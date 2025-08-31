// Seedable LCG RNG
export class RNG{
  constructor(seed=123456789){
    this.state = seed >>> 0;
  }
  next(){
    // 32-bit LCG parameters (Numerical Recipes variant)
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state;
  }
  float(){
    return (this.next() >>> 8) / 0x01000000; // (0,1)
  }
  int(min, max){
    if(min>max) [min,max] = [max,min];
    const u = this.float();
    return Math.floor(u*(max-min+1)) + min;
  }
}

