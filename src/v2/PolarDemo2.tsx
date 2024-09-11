import { useState } from "react";

import { getXComponent, getYComponent, Vector2 , length, mul, angle, PI_OVER_2, fromPolar, negate, add, ORIGIN, midpoint, toDegreesString, degreesString } from "../components/Vector2";

import "./PolarDemo2.scss";
import Canvas2, { Line, Text, Arc } from "./Canvas2";

export default function PolarDemo2() {
	
	const [v, setV] = useState<Vector2|null>( null );
	//console.log({ mousePosition });
	
	let lengthText:string = "";
	let xComponentText:string = "";
	let yComponentText:string = "";
	let angleText:string = getAngleText();
	if( v ){
		lengthText = ""+Math.round( length(v) );
		xComponentText = ""+Math.round( v.x );
		yComponentText = ""+Math.round( v.y );
	}
	
	let lengthTextPosition:Vector2|null = getLengthTextPosition();
	let xComponentTextPosition:Vector2|null = getXComponentTextPosition();
	let yComponentTextPosition:Vector2|null = getYComponentTextPosition();
	const angleTextPosition = getAngleTextPosition();
	
	
	function getLengthTextPosition(): Vector2|null {
		
		if( v == null ){
			return null;
		}
		
		let lengthTextPosition:Vector2|null = mul( v , 0.5 );
		let orthogAngle:number = angle(lengthTextPosition);
		if( v.x > 0 && v.y > 0 )  orthogAngle += PI_OVER_2;
		if( v.x < 0 && v.y > 0 )  orthogAngle -= PI_OVER_2;
		if( v.x < 0 && v.y < 0 )  orthogAngle += PI_OVER_2;
		if( v.x > 0 && v.y < 0 )  orthogAngle -= PI_OVER_2;
		
		let orthogDisplacement:Vector2 = fromPolar( 10 , orthogAngle );
		lengthTextPosition = add( lengthTextPosition , orthogDisplacement );
		
		return lengthTextPosition;
	}
	function getXComponentTextPosition(): Vector2|null {
		if( v == null ){
			return null;
		}
		
		let position = midpoint( ORIGIN , getXComponent(v) );
		
		if( v.y >= 0 ){
			position = add( position , {x:0,y:-10});
		}
		else{
			position = add( position , {x:0,y:+10});
		}
		
		return position;
	}
	function getYComponentTextPosition(): Vector2|null {
		if( v == null ){
			return null;
		}
		
		let position = midpoint( v , getXComponent(v) );
		if( v.x >= 0 ){
			position = add( position , {x:+10,y:0});
		}
		else{
			position = add( position , {x:-10,y:0});
		}
		
		return position;
	}
	function getAngleText(){
		if( !v ){
			return "";
		}
		
		return degreesString( v );
		
	}
	function getAngleTextPosition(){
		
		if( !v ){
			return null;
		}
		
		return fromPolar( 40 , angle(v)/2 );
	}
	
	function mouseMoved(p:Vector2){
		setV(p)
	}
	
	
	return (
		<Canvas2 mouseMoved={mouseMoved} className="polar-demo-2">
			{ v && lengthTextPosition && xComponentTextPosition && yComponentTextPosition && angleTextPosition &&
				<>
					<Line className="vector"
						p1={ORIGIN} 
						p2={v}
						pixelThickness={3}
					/>
					<Line className="x-component"
						p1={ORIGIN}
						p2={ getXComponent(v) }
						pixelThickness={3}
					/>
					<Line className="y-component"
						p1={getXComponent(v)}
						p2={v}
						pixelThickness={3}
					/>
					
					
					<Text text={lengthText} location={lengthTextPosition} className="length-text"/>
					
					<Text text={xComponentText} location={xComponentTextPosition} className="x-component-text"/>
					<Text text={yComponentText} location={yComponentTextPosition} className="y-component-text"/>
					
					<Arc center={ORIGIN} radius={30} startingAngle={0} endingAngle={angle(v)} pixelThickness={3} className="angle" />
					<Text text={angleText} location={angleTextPosition} className="angle"/>
				</>
				
			}
			
		</Canvas2>

	)
}
