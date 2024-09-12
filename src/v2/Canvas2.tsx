import { createContext, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"
import { add, addPolar, fixAngle, ORIGIN, rotate, Vector2, ZERO } from "../components/Vector2"
import { CanvasClass } from "./CanvasClass"

import "./Canvas2.scss";


const CanvasContext = createContext<CanvasClass>(new CanvasClass(ZERO,0));
export const useCanvas2State = () => useContext(CanvasContext);



type Canvas2Props = {
	center?: Vector2
	zoom?: number 
	mouseMoved?: (v:Vector2) => void
	mousePressed?: (v:Vector2) => void
	update?: (dt:number) => void
	className?: string
	children?: React.ReactNode
	// mouseMoved?: (v:Vector2)=>void
	// onMouseDown?: (v:Vector2)=>void
	// update?: (deltaT:number)=>void
}
export default function Canvas2({ center=ORIGIN , zoom=1 , mouseMoved=(v)=>{} , mousePressed=(v)=>{} , update=(dt)=>{} , className , children }: Canvas2Props) {
	
	//const [canvasClass, setCanvasClass] = useState( new CanvasClass( center , zoom ) );
	const [canvasClass, setCanvasClass] = useState<CanvasClass|null>( null );
	
	
	const [_, forceUpdate] = useReducer(x => x + 1, 0);
	
	const targetRef = useRef();
	const [pixelDimensions, setPixelDimensions] = useState({ width: 0 , height: 0 });

	let movement_timer:number|undefined = undefined;
	const RESET_TIMEOUT = 100;

	const test_dimensions = () => {
		//console.log("test_dimensions");
		
		if (targetRef.current) {
			
			const pixelDimensions ={
				//@ts-ignore
				width: targetRef.current.offsetWidth,
				//@ts-ignore
				height: targetRef.current.offsetHeight
			}
			
			setPixelDimensions(pixelDimensions);
		}
	}

	useLayoutEffect(() => {
		test_dimensions();
	}, []);

	window.addEventListener('resize', () => {
		clearInterval(movement_timer);
		movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
	});
	
	useLayoutEffect(() => {
		
		if( canvasClass == null ){
			return;
		}
		
		canvasClass.pixelDimensions = pixelDimensions;
		setCanvasClass( canvasClass );
		
	}, [pixelDimensions]);
	
	
	// canvasClass.getPixelDimensions = () => {
	// 	return pixelDimensions;
	// }
	// canvasClass.repaint = () => forceUpdate();
	// canvasClass.mouseMoved = mouseMoved;
	
	//const [canvasClass, setCanvasClass] = useState<CanvasClass>( canvasClassInit );
	
	useEffect(() => {
		
		
		const pd ={
			//@ts-ignore
			width: targetRef.current.offsetWidth,
			//@ts-ignore
			height: targetRef.current.offsetHeight
		}
		setPixelDimensions(pd);
		
		const canvasClass = new CanvasClass( center , zoom );
		canvasClass.pixelDimensions = pd;
		canvasClass.repaint = () => forceUpdate();
		canvasClass.mouseMoved = mouseMoved;
		canvasClass.mousePressed = mousePressed;
		canvasClass.update = update;
		
		setCanvasClass( canvasClass );
		canvasClass.start();
		
		
	}, [])
	
	
	
	
	
	
	
	
	// const requestRef = useRef();
	
	// const animate = time => {
	// 	if( canvasClass == null ){
	// 		return
	// 	}
		
	// 	const newTime = time/1000;
	// 	console.log("animate - tick");
		
		
	// 	canvasClass.tick( newTime );
		
	// 	requestRef.current = requestAnimationFrame(animate);
	// }
	
	// useEffect(() => {
	// 	requestRef.current = requestAnimationFrame(animate);
	// 	return () => cancelAnimationFrame(requestRef.current);
	// }, []); // Make sure the effect runs only once
	
	// useEffect(() => {
	// 	if( props.update ){
	// 		props.update( deltaTime );
	// 	}
	// }, [time]); // Make sure the effect runs only once
	
	
	
	
	
	
	
	
	
	let cn = "canvas2";
	if( className )  cn += " " + className;
	
	const pixelDimensionsText = `${pixelDimensions.width} × ${pixelDimensions.height}px`;
	//console.log("pixel dimensions: " + pixelDimensionsText);
	
	
	if( canvasClass == null ){
		return (
			<div className={cn} ref={ targetRef }>
			
			</div>
		)
	}
	
	return (
		<CanvasContext.Provider value={ canvasClass }>
			
		
			<div className={cn} ref={ targetRef }
				onMouseMove={e => canvasClass.onMouseMove(e)}
				// onMouseDown={e => onMouseDown(e)}
				onMouseLeave={ e => canvasClass.onMouseLeave(e) }
				// onWheel={e => onWheel(e)}
				
				onMouseDown={ e => canvasClass.onMouseDown(e) }
				onMouseUp={ e => canvasClass.onMouseUp(e) }
				
				>
					
				<svg viewBox={`0 0 ${pixelDimensions.width} ${pixelDimensions.height}`}>

					<text x="20" y="35" fill="currentColor">
						{pixelDimensionsText}
					</text>
					
					<Time />
					
					<Gridlines />
					<MouseCoordinates />
					
					{children}

				</svg>
				
			</div>
		</CanvasContext.Provider>
	)
}

function Gridlines(){
		
	return(
		<g className="gridlines">
			<HorizontalGridlines />
			<VerticalGridlines />
		</g>
	);
	
}
function VerticalGridlines(){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const spanW = canvasClass.getSpan().width;
	
	const log10 = Math.log10(spanW);
	const floor = Math.floor( log10 );
	let increment = Math.pow( 10 , floor );
	const divisions = spanW / increment;
	
	if(divisions < 2){
		increment = Math.pow( 10 , floor-1 );
	}
	
	const minX = Math.floor(canvasClass.getMin().x / increment) * increment;
	const maxX = canvasClass.getMax().x;
	
	
	const gridlines = [];
	for (let x = minX; x <= maxX; x += increment ) {
		const gridline = <VerticalGridline x={x} key={`vertical-gridline-${x}`}/>;
		gridlines.push( gridline );
	}
	
	return(
		<g className="vertical-gridlines">
			{ gridlines }
		</g>
	);
	
}
function VerticalGridline({ x }: {x:number}){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const y1 = canvasClass.getMin().y;
	const y2 = canvasClass.getMax().y;
	
	const pixel1 = canvasClass.getPixel({ x:x , y:y1 })
	const pixel2 = canvasClass.getPixel({ x:x , y:y2 })
	
	let strokPixelWidth = 1;
	if( x === 0 ){
		strokPixelWidth = 2;
	}
	
	
	const pixelFontSize = 10;
	const textPixelX = pixel1.x + 2;
	const textPixelY = 8;
	
	return(
		<g>
			<line x1={pixel1.x} y1={pixel1.y} x2={pixel2.x} y2={pixel2.y} stroke="currentColor" strokeWidth={strokPixelWidth}/>
			
			<text x={textPixelX} y={textPixelY} fill="currentColor" fontSize={pixelFontSize}  >
				{x}
			</text>
		</g>
	);
}

function HorizontalGridlines(){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const spanH = canvasClass.getSpan().height;
	
	const log10 = Math.log10(spanH);
	const floor = Math.floor( log10 );
	let increment = Math.pow( 10 , floor );
	const divisions = spanH / increment;
	
	if(divisions < 2){
		increment = Math.pow( 10 , floor-1 );
	}
	
	const minY = Math.floor(canvasClass.getMin().y / increment) * increment;
	const maxY = canvasClass.getMax().y;
	
	const gridlines = [];
	
	for (let y = minY; y <= maxY; y+=increment ) {
		const gridline = <HorizontalGridline y={y} key={`horizontal-gridline-${y}`}/>;
		gridlines.push( gridline );
	}
	
	return(
		<g className="horizontal-gridlines">
			{ gridlines }
		</g>
	);
	
}
function HorizontalGridline({ y }: {y:number}){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const x1 = canvasClass.getMin().x;
	const x2 = canvasClass.getMax().x
	
	const pixel1 = canvasClass.getPixel({ x:x1 , y:y })
	const pixel2 = canvasClass.getPixel({ x:x2 , y:y })
	
	
	let strokPixelWidth = 1;
	if( y === 0 ){
		strokPixelWidth = 2;
	}
	
	const pixelFontSize = 10;
	const textPixelX = 2;
	const textPixelY = pixel1.y - 3;
	
	return(
		<g>
			<line x1={pixel1.x} y1={pixel1.y} x2={pixel2.x} y2={pixel2.y} stroke="currentColor" strokeWidth={strokPixelWidth}/>
			
			<text x={textPixelX} y={textPixelY} fill="currentColor" fontSize={pixelFontSize} >
				{y}
			</text>
		</g>
	);
}


export function Line({ p1 , p2 , pixelThickness=1 , className }: {p1:Vector2,p2:Vector2, pixelThickness?:number, className?:string}){
	
	const canvasClass = useCanvas2State(); 
	if( canvasClass == null ) {
		console.log("Line - canvasClass is null");
		
		return null;
	}
	
	
	const pixel1 = canvasClass.getPixel( p1 );
	const pixel2 = canvasClass.getPixel( p2 );
	
	//console.log("line: " + pixel1.x + "," + pixel1.y + " - " + pixel2.x + "," + pixel2.y);
	
	
	let cn = "line";
	if( className )  cn += " " + className;
	
	return(
		<line
			x1={pixel1.x}
			y1={pixel1.y}
			x2={pixel2.x}
			y2={pixel2.y}
			stroke="currentColor"
			strokeWidth={pixelThickness} 
			className={cn}
		/>
	);
}
export function Circle({ center , radius , angle=0 , drawAngleLine=false , className }: {center:Vector2, radius:number, angle?:number , drawAngleLine?:boolean, className?:string}){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const pixelCenter = canvasClass.getPixel( center );
	const pixelRadius = canvasClass.getPixelDistance( radius );
	
	console.log("Circle" + " center: " + JSON.stringify(center) + " pixelCenter: " + JSON.stringify(pixelCenter) );
	
	
	let cn = "circle";
	if( className )  cn += " " + className;
	
	return(
		<>
			<circle cx={pixelCenter.x} cy={pixelCenter.y} r={pixelRadius} stroke="transparent" fill="currentColor" className={cn} />
			{ drawAngleLine && 
				<Line p1={center} p2={addPolar(center,radius,angle)}/>
			}
		</>
		
	);
}
export function Polygon({ offset , angle , vertices , className }: {offset:Vector2, angle:number , vertices:Vector2[], className?:string}){
	
	const canvasClass = useCanvas2State();  if( canvasClass == null ) return null;
	
	vertices = vertices
		.map( vertice => rotate(vertice,angle) )
		.map( vertice => add(vertice,offset));
	
	const pixelVertices = vertices.map( vertice => canvasClass.getPixel(vertice) );
	
	const pointsString = pixelVertices.map( pixelVertice => `${pixelVertice.x},${pixelVertice.y}` ).join(" ");
	//console.log({ pointsString });
	
	
	//console.log({ vertices });
	let cn = "polygon";
	if( className )  cn += " " + className;
	
		
	return(
		<>
			<polygon points={pointsString} fill="currentColor" stroke="none" className={cn} />
		
			{/* { pixelVertices.map( (pixelVertice,i) => {
				
				const verticePixelR = 3;
				return <circle cx={pixelVertice.x} cy={pixelVertice.y} r={verticePixelR} stroke="transparent" fill="currentColor" className="polygon-vertice" key={"polygon-vertice-"+i} />
			})} */}
		</>
		
	);
}
type ArcProps = {
	center:Vector2
	radius:number
	startingAngle:number
	endingAngle:number
	pixelThickness?:number
	className?:string
}
export function Arc({ center , radius , startingAngle , endingAngle , pixelThickness , className }: ArcProps){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const startPoint = addPolar( center , radius , startingAngle );
	const endPoint = addPolar( center , radius , endingAngle );
	
	const pixelCenter = canvasClass.getPixel( center );
	const pixelRadius = canvasClass.getPixelDistance( radius );
	const pixelStart = canvasClass.getPixel( startPoint );
	const pixelEnd = canvasClass.getPixel( endPoint );
	
	
	let angleDiff = (endingAngle - startingAngle);
	angleDiff = fixAngle( angleDiff );
	
	const rotation = 0;
	const largeArcFlag = (angleDiff > Math.PI) ? 1 : 0 ;
	const sweepFlag = 0;
	
	
	let cn = "line";
	if( className )  cn += " " + className;
	
	return(
		<>
			{/* <circle cx={pixelCenter.x} cy={pixelCenter.y} r={pixelRadius} stroke="red" fill="none" />
			<circle cx={pixelStart.x} cy={pixelStart.y} r={2} stroke="none" fill="yellow" />
			<circle cx={pixelEnd.x} cy={pixelEnd.y} r={2} stroke="none" fill="orange" />
			
			<text x={300} y={70} fill="currentColor" fontSize={12} dominant-baseline="middle" text-anchor="middle" >
				{`${toDegreesString(startingAngle)} to ${toDegreesString(endingAngle)}`}
			</text>
			<text x={300} y={100} fill="currentColor" fontSize={12} dominant-baseline="middle" text-anchor="middle" >
				{angleDiff}
			</text> */}
			
			<path 
				d={` M ${pixelStart.x} ${pixelStart.y} A ${pixelRadius} ${pixelRadius} ${rotation} ${largeArcFlag} ${sweepFlag} ${pixelEnd.x} ${pixelEnd.y}`} 
				stroke="currentColor"
				strokeWidth={pixelThickness} 
				fill="none"
				className={cn}
			/>
			
		</>
		
	);
	
	
}
export function Text({ text , location , fontSize=16 , className }: { text:string , location:Vector2 , fontSize?:number , className?:string }){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	const pixel = canvasClass.getPixel( location );
	const pixelFontSize = 16;
	
	let cn = "text";
	if( className )  cn += " " + className;
	
	return(
		<text x={pixel.x} y={pixel.y} fill="currentColor" fontSize={pixelFontSize} dominantBaseline="middle" textAnchor="middle" className={cn}>
			{ text }
		</text>
	);
	
}

function MouseCoordinates(){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	if( canvasClass.mousePosition == null ){
		return null;
	}
	
	let pixelRadius = 5;
	let pixelFontSize = 16;
	
	
	const mousePixel = canvasClass.getPixel( canvasClass.mousePosition );
	
	const textPixelX = mousePixel.x - 30;
	const textPixelY = mousePixel.y - 10;
	
	return(
		
		<>
			<circle cx={mousePixel.x} cy={mousePixel.y} r={pixelRadius} stroke="transparent" fill="red" />
			
			<text x={textPixelX} y={textPixelY} fill="red" fontSize={pixelFontSize} >
				{ Math.round(canvasClass.mousePosition.x)+" , "+Math.round(canvasClass.mousePosition.y)}
			</text>
		</>
	);
	
}

export function Time(){
	
	const canvasClass = useCanvas2State(); if( canvasClass == null ) return null;
	
	function getTimeString( timeInSeconds:number ): string{
		
		timeInSeconds = Math.round( timeInSeconds );
		
		let s = 0;
		let m = 0;
		let h = 0;
		
		h = Math.floor( timeInSeconds / 3600 );
		m = Math.floor( (timeInSeconds-h*3600) / 60 );
		s = timeInSeconds - h*3600 - m*60;
		
		let hText = ( h < 10 ) ? ( "0" + h ) : ( "" + h );
		let mText = ( m < 10 ) ? ( "0" + m ) : ( "" + m );
		let sText = ( s < 10 ) ? ( "0" + s ) : ( "" + s );
		
		if( h == 0 )
		{
			return mText + ":" + sText;
		}
		else
		{
			return hText + ":" + mText + ":" + sText;
		}
		
	}
	
	return(
		<text x="20" y="70" fill="currentColor">
			{getTimeString(canvasClass.time)}
		</text>
	);
	
	
	
	
}