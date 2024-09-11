import { b2BodyDef, b2BodyType, b2BodyUserData, b2CircleShape, b2PolygonShape, b2World } from "@box2d/core";
import Box2dCanvas from "../components/Box2dCanvas";
import { toRadians, Vector2 } from "../components/Vector2";


export default function Box2dCanvasDemo() {
	
	const gravity = { x: 0, y: -10 };
	const world:b2World = b2World.Create(gravity)
	
	spawnGround( world );
	spawnBall( world , { x: 0, y: 7 } );
	spawnBox( world );
	
	return (
		<Box2dCanvas world={world} onMouseDown={ (p:Vector2) => spawnBall(world,p) } />
	)
	
	
	
	function spawnGround( world:b2World ){
		const groundHeight = 0.25;
		const groundBodyDef: b2BodyDef = {
			position: { x: 0, y: -groundHeight/2 },
			angle: toRadians(-5),
		};
		const groundBody = world.CreateBody(groundBodyDef);
		const groundBox:b2PolygonShape = new b2PolygonShape();
		groundBox.SetAsBox(5, groundHeight/2);
		groundBody.CreateFixture({ shape: groundBox });
		
	}
	function spawnBall( world:b2World , position:Vector2 ){
		
		const ballRadius = 0.2;
		const ballBodyDef: b2BodyDef = {
			type: b2BodyType.b2_dynamicBody,
			position: position,
			angle: 0,
		};
		const ballBody = world.CreateBody(ballBodyDef);
		const circleShape = new b2CircleShape( ballRadius );
		ballBody.CreateFixture({ shape: circleShape , density: 1 , friction: 0.3 , restitution: 0.5 });
		
		
	}
	function spawnBox( world:b2World ){
		
		
		const bodyDef: b2BodyDef = {
			type: b2BodyType.b2_dynamicBody,
			position: { x: 2, y: 7 },
			angle: 0,
		};
		const body = world.CreateBody(bodyDef);
		body.SetAngularDamping( 0.2 )
		const boxShape = new b2PolygonShape();
		boxShape.SetAsBox(0.2, 0.2);
		body.CreateFixture({ shape: boxShape , density: 1 , friction: 0.3 , restitution: 0.5 });
		
		
	}
	
	
}
