import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2PolygonShape, b2Shape, b2ShapeType, b2StepConfig, b2Vec2, b2World } from "@box2d/core";
import Canvas, { Arc, Circle, Line, Polygon, Text , useCanvasState } from "../components/Canvas";
import { useEffect, useState } from "react";
import { add, toRadians, Vector2 } from "./Vector2";

import "./Box2dCanvas.scss";

export default function Box2dCanvas({ world , className }: { world:b2World , className?:string }) {

	
	// const [w, setW] = useState(world);
	
	const stepConfig: b2StepConfig = {
		velocityIterations: 6,
		positionIterations: 2,
	};
	function update(deltaT: number) {

		world.Step(deltaT, stepConfig);
		
		
		
		
		//console.log({ bodies: getAllBodies( world ) });
		

	}
	// useEffect(() => {
	// 	setW( world );

	// }, [world])
	
	
	
	
	let cn = "box2d-canvas";
	if( className )  cn += " " + className;
	
	
	return (
		<Canvas zoom={70} center={{ x: 0, y: 3 }} update={update} className={cn} >

			{ getAllBodies(world).map( (body,i) => 
				<B2Body body={body} key={"body-"+i}/>
			)}
			
		</Canvas>
	)
	
	function B2Body({ body }: {body:b2Body }){
		
		const transform = body.GetTransform();
		const bodyPosition:Vector2 = body.GetPosition() as Vector2;
		//const angle:number = transform.GetAngle();
		
		const angle:number = body.GetAngle();
		console.log({ bodyPosition });
		
		
		//console.log({ position: bodyPosition , angle });
		
		const fixtures:b2Fixture[] = getAllFixtures( body );
		const shapes:b2Shape[] = fixtures.map( fixture => fixture.GetShape() );
		
		return(
			<>
				{ shapes.map( (shape,i) => 
					<B2Shape shape={shape} offset={bodyPosition} angle={angle} key={i}/>
				)}
			</>
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
		
		//console.log({ shapeType });
		
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
		console.log("angle: " + angle);
		
			
		return <Circle center={offset} radius={radius} angle={angle} drawAngleLine/>
		
		
	}
	function B2PolygonShape({ polygonShape , offset , angle }: {polygonShape:b2PolygonShape , offset:Vector2 , angle:number}){
		
		let vertices:Vector2[] = polygonShape.m_vertices;
		
		//vertices = vertices.map( vertice => add(vertice,offset));
		
		//console.log({ vertices });
		
		
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
