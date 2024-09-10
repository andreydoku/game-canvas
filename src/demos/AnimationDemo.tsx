import { useState } from "react";
import Canvas, { Arc, Circle, Line, Text , useCanvasState } from "../components/Canvas";
import { getXComponent, getYComponent, Vector2 , length, mul, angle, PI_OVER_2, fromPolar, negate, add, ORIGIN, midpoint, toDegreesString, degreesString, toDegrees, toRadians } from "../components/Vector2";

import "./AnimationDemo.scss";

export default function AnimationDemo() {
	
	
	const [ballPosition, setBallPosition] = useState<Vector2>( {x:-400, y: 100} );
	const velocity:Vector2 = fromPolar( 300 , toRadians(-30) );
	
	
	function update( deltaT:number ){
		
		const newPosition = add( ballPosition , mul(velocity,deltaT) );
		setBallPosition( newPosition );
		
	}
	

	return (
		<Canvas zoom={0.25} center={{ x:0 , y:0 }} update={update} className="animation-demo">
			
			<Circle center={ballPosition} radius={50} className="ball"/>
				
			
			
		</Canvas>
	)
}
