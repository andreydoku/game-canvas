// export class Vector2 {
// 	x: number;
// 	y: number;

// 	constructor(x:number, y:number) {
// 		this.x = x;
// 		this.y = y;
// 	}
	
// 	length(){
// 		return Math.sqrt( this.x*this.x + this.y*this.y );
// 	}
	
// 	plus( v:Vector2 ){
// 		return new Vector2( this.x + v.x , this.y + v.y );
// 	}
// 	minus( v:Vector2 ){
// 		return new Vector2( this.x - v.x , this.y - v.y );
// 	}

// }

export type Vector2 = {
	x: number;
	y: number;
}

export const ORIGIN = {x:0 , y: 0};
export const ZERO = {x:0 , y: 0};
export const PI_OVER_2 = Math.PI / 2;
export const TWO_PI = 2 * Math.PI;

export function getXComponent(v:Vector2): Vector2 {
	return {
		x: v.x,
		y: 0
	}
}
export function getYComponent(v:Vector2): Vector2 {
	return {
		x: 0,
		y: v.y
	}
}

export function add( v1:Vector2 , v2:Vector2 ): Vector2 {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y
	}
}
export function mul( v:Vector2 , k:number ): Vector2 {
	return {
		x: k * v.x,
		y: k * v.y,
	}
}
export function negate( v:Vector2 ): Vector2 {
	return {
		x: -1 * v.x,
		y: -1 * v.y,
	}
}

export function length( v:Vector2 ): number{
	return Math.sqrt( v.x*v.x + v.y*v.y );
}
export function angle( v:Vector2 ): number {
	let angle = Math.atan2( v.y, v.x );
	angle = fixAngle( angle );
	return angle;
}
export function degrees( v:Vector2 ): number {
	const a = angle(v);
	return toDegrees(a);
}
export function degreesString( v:Vector2 ): string {
	const a = angle(v);
	return toDegreesString(a);
}

export function setLength( v:Vector2 , length:number ): Vector2 {
	const a:number = angle(v);
	return fromPolar(length, a);
}

export function setAngle( v:Vector2 , angle:number ): Vector2 {
	const len:number = length(v);
	return fromPolar(len, angle);
}

export function addAngle( v:Vector2 , deltaAngle:number ): Vector2 {
	const len:number = length(v);
	const a:number = angle(v);
	return fromPolar(len, a + deltaAngle);
}

export function rotate( v:Vector2 , deltaAngle:number ): Vector2 {
	return addAngle( v , deltaAngle );
}



export function fromPolar( length:number , angle:number ): Vector2{
	return {
		x: length * Math.cos( angle ),
		y: length * Math.sin( angle ),
	}
}
export function addPolar( v:Vector2 , length:number , angle:number ){
	return add( v , fromPolar(length,angle) );
}

export function midpoint( v1:Vector2 , v2:Vector2 ): Vector2 {
	return {
		x: (v1.x + v2.x)/2,
		y: (v1.y + v2.y)/2,
	}
}










export function toDegrees( radians:number ): number {
	return radians * 180.0 / Math.PI;
}
export function toDegreesString( radians:number ):string{
	const degrees = toDegrees( radians );
	
	return Math.round(degrees) + "°";
	
}

export function toRadians( degrees:number ): number {
	return degrees * Math.PI / 180.0;
}
export function fixAngle( angle:number ){
	
	let fixedAngle = angle % TWO_PI;
	if( fixedAngle < 0 ){
		fixedAngle += TWO_PI;
	}
	return fixedAngle;
}
