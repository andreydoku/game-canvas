import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2PolygonShape, b2Shape, b2ShapeType, b2StepConfig, b2Vec2, b2World } from "@box2d/core";
//import Canvas, { Arc, Circle, Line, Polygon, Text , useCanvasState } from "../components/Canvas";
import Canvas2, { Arc, Circle, Line, Polygon, Text } from "./Canvas2";
import { useEffect, useReducer, useState } from "react";
import { add, toRadians, Vector2 } from "../components/Vector2";

import "./Box2dCanvas2.scss";


type Box2dCanvas2Props = { 
	world: b2World , 
	mousePressed?: (p:Vector2)=>void, 
	className?: string 
}
export default function Box2dCanvas2({ world , mousePressed , className }: Box2dCanvas2Props) {

	
	// const [w, setW] = useState(world);
	const [_, forceUpdate] = useReducer(x => x + 1, 0);
	
	const stepConfig: b2StepConfig = {
		velocityIterations: 6,
		positionIterations: 2,
	};
	function update(deltaT: number) {
		
		world.Step(deltaT, stepConfig);
		forceUpdate();
	}

	
	
	
	
	let cn = "box2d-canvas-2";
	if( className )  cn += " " + className;
	
	
	return (
		<Canvas2 zoom={70} center={{ x: 0, y: 3 }} update={update} mousePressed={mousePressed} className={cn} >

			{ getAllBodies(world).map( (body,i) => 
				<B2Body body={body} key={"body-"+i}/>
			)}
			
		</Canvas2>
	)
	
	function B2Body({ body }: { body:b2Body }){
		
		const bodyPosition:Vector2 = body.GetPosition() as Vector2;
		const bodyAngle:number = body.GetAngle();
		
		const fixtures:b2Fixture[] = getAllFixtures( body );
		const shapes:b2Shape[] = fixtures.map( fixture => fixture.GetShape() );
		
		const bodyType:b2BodyType = body.GetType();
		
		let cn = "body";
		if( bodyType == b2BodyType.b2_dynamicBody )    cn += " dynamic";
		if( bodyType == b2BodyType.b2_kinematicBody )  cn += " kinematic";
		if( bodyType == b2BodyType.b2_staticBody )     cn += " static";
		
		
		return(
			<g className={cn}>
				{ shapes.map( (shape,i) => 
					<B2Shape shape={shape} offset={bodyPosition} angle={bodyAngle} key={i}/>
				)}
			</g>
		)
		
	}
	
	function getAllFixtures( body:b2Body ){
		
		const fixtures:b2Fixture[] = [];
		
		let fixture:b2Fixture|null = body.GetFixtureList();
		while( fixture != null )
		{
			fixtures.push( fixture );
			fixture = fixture.GetNext();
		}
		
		return fixtures;
	}
	function getAllBodies( world:b2World ): b2Body[]{
		
		const bodies:b2Body[] = [];
		
		let body:b2Body|null = world.GetBodyList();
		while( body != null )
		{
			bodies.push( body );
			body = body.GetNext();
		}
		
		return bodies;
		
	}
	
	function B2Shape({ shape , offset , angle } : { shape:b2Shape , offset:Vector2 , angle:number }){
		
		const shapeType:b2ShapeType = shape.GetType();
		
		if( shapeType == b2ShapeType.e_circle ){
			
			const circleShape:b2CircleShape = shape as b2CircleShape;
			return <B2CircleShape circleShape={circleShape} offset={offset} angle={angle}/>
			
		}
		if( shapeType == b2ShapeType.e_polygon ){
			
			const polygonShape:b2PolygonShape = shape as b2PolygonShape;
			return <B2PolygonShape polygonShape={polygonShape} offset={offset} angle={angle}/>
		}
		
		return(
			<></>
		)
		
	}
	
	function B2CircleShape({ circleShape , offset , angle }: { circleShape:b2CircleShape , offset:Vector2 , angle:number }){
		
		const radius = circleShape.m_radius;
		console.log({ offset , radius });
		
		return <Circle center={offset} radius={radius} angle={angle} drawAngleLine/>
		
		
	}
	function B2PolygonShape({ polygonShape , offset , angle }: {polygonShape:b2PolygonShape , offset:Vector2 , angle:number}){
		
		let vertices:Vector2[] = polygonShape.m_vertices;
		
		
		return(
			<>
				{/* <Text text={verticesText} location={{x:0,y:0}} className="length-text"/> */}
				{/* { vertices.map( (vertice,i) => 
					<Circle center={vertice} radius={0.05} key={i}/>
				) } */}
				
				<Polygon offset={offset} angle={angle} vertices={vertices}/>
			</>
			
		);
		
	}
}
