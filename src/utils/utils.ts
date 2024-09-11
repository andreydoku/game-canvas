import { b2Body, b2BodyDef, b2FixtureDef, b2World } from "@box2d/core";


export type CreateBodyInput = {
	bodyDef: b2BodyDef,
	fixtureDefs: b2FixtureDef[]
}
export function createBody( createBodyInput:CreateBodyInput , world:b2World ): b2Body {
	
	const body = world.CreateBody( createBodyInput.bodyDef );
	
	createBodyInput.fixtureDefs.forEach( fixtureDef => 
		body.CreateFixture( fixtureDef )
	);
	
	return body;
}

