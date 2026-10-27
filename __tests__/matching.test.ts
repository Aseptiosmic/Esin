import {describe,it,expect} from 'vitest';import {cosine,resolveTwins,scorePercent,tfidfSimilarities,type TwinProfile} from '../src/features/twins/matching';
const profile=(nickname:string,genre_counts:Record<string,number>,score=0):TwinProfile=>({nickname,genre_counts,score,common_tracks:[],common_artist_count:0});
describe('twin matching',()=>{
  it('calculates shared track and artist score percentage',()=>expect(scorePercent(125,10,5)).toBe(100));
  it('clamps percent above the maximum at 100 and handles a zero denominator',()=>{expect(scorePercent(9999,1,1)).toBe(100);expect(scorePercent(10,0,0)).toBe(0);});
  it('calculates cosine similarity and zero-vector behavior',()=>{expect(cosine({rock:2,pop:1},{rock:4,pop:2})).toBeCloseTo(1);expect(cosine({rock:1},{jazz:1})).toBe(0);expect(cosine({},{})).toBe(0);});
  it('falls back to TF-IDF cosine when all RPC scores are zero',()=>{const rows=[profile('A',{rock:4}),profile('B',{jazz:4})];const result=resolveTwins(rows,{rock:2});expect(result.fallback).toBe(true);expect(result.results[0].nickname).toBe('A');expect(result.results[0].similarity??0).toBeGreaterThan(result.results[1].similarity??0);});
  it('uses RPC scores when at least one score is non-zero',()=>{const result=resolveTwins([profile('A',{rock:1},10),profile('B',{rock:2},0)],{rock:1});expect(result.fallback).toBe(false);});
  it('returns no misleading matches for an empty profile set',()=>expect(tfidfSimilarities([],{rock:1})).toEqual([]));
});
