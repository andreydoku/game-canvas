import { addPolar, fixAngle, toDegreesString, toRadians, TWO_PI, Vector2 } from "./Vector2"
import "./Canvas.scss";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";


export type CanvasState = {
	getPixel: (v:Vector2) => Vector2,
	getPixelDistance: (d:number) => number,
	time: number
}
const CanvasContext = createContext<CanvasState>({
	getPixel: (v:Vector2) => {return v},
	getPixelDistance: (d:number) => 0,
	time: 0,
})
export const useCanvasState = () => useContext(CanvasContext);



type CanvasProps = {
	className?: string
	zoom: number
	center: Vector2
	children?: React.ReactNode
	mouseMoved?: (v:Vector2)=>void
	update?: (deltaT:number)=>void
}
export default function Canvas(props: CanvasProps) {
	
	// ========== Canvas - pixel dimensions ==========================================================
	const targetRef = useRef();
	const [pixelDimensions, setPixelDimensions] = useState({ width: 0 , height: 0 });

	let movement_timer:number|undefined = undefined;
	const RESET_TIMEOUT = 100;

	const test_dimensions = () => {
		if (targetRef.current) {
			setPixelDimensions({
				//@ts-ignore
				width: targetRef.current.offsetWidth,
				//@ts-ignore
				height: targetRef.current.offsetHeight
			});
		}
	}

	useLayoutEffect(() => {
		test_dimensions();
	}, []);

	window.addEventListener('resize', () => {
		clearInterval(movement_timer);
		movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
	});
	
	function getPixelCenter(): Vector2 {
		
		return { 
			x: getPixelCenterX(),
			y: getPixelCenterY(),
		}
		
	}
	function getPixelCenterX(): number {
		
		return pixelDimensions.width/2;
		
	}
	function getPixelCenterY(): number {
		
		return pixelDimensions.height/2;
		
	}
	
	
	const pixelDimensionsText = `${pixelDimensions.width} × ${pixelDimensions.height}px`;
	
	
	
	
	// ========== coordinate system - pixel to world coords ======================================================
	
	const [center, setOffset] = useState<Vector2>( props.center ); 
	const [zoom, setZoom] = useState<number>( props.zoom ); 
	
	function getPoint( pixelPoint:Vector2 ): Vector2{

		return { 
			x: getX( pixelPoint.x ),
			y: getY( pixelPoint.y )
		}
		
	}
	function getX( pixelx:number ): number{
		
		if( center == null )
		{
			return 0;
		}
		return center.x + ( pixelx - getPixelCenterX() ) / zoom;
		
	}
	function getY( pixely:number ): number{
		
		if( center == null )
		{
			return 0;
		}
		return center.y - ( pixely - getPixelCenterY() ) / zoom;
		
	}
	
	function getPixel( p: Vector2 ): Vector2{
		
		return {
			x: getPixelX( p.x ),
			y: getPixelY( p.y )
		}
		
		
	}
	function getPixelX( x:number ): number {
		
		if( center == null )
		{
			return 0;
		}
		
		return zoom *(x-center.x) + getPixelCenterX();
		
	}
	function getPixelY( y:number ): number {
		
		if( center == null )
		{
			return 0;
		}
		
		return -zoom *(y-center.y) + getPixelCenterY();
		
	}
	
	function getMinX(): number{
		
		return getX( 0 );
		
	}
	function getMaxX(): number{
		
		return getX( pixelDimensions.width );
		
	}
	
	function getMinY(): number{
		
		return getY( pixelDimensions.height );
		
	}
	function getMaxY(): number{
		
		return getY( 0 );
		
	}
	
	function getSpanX(): number{
		
		return pixelDimensions.width/ zoom;
		
	}
	function getSpanY(): number{
		
		return pixelDimensions.height/ zoom;
		
	}
	
	function getPixelDistance( distance:number ): number{
		
		return distance * zoom;
		
	}
	function getDistance( pixelDistance: number ): number{
		
		return ( pixelDistance ) / zoom;
		
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
		
		const spanX = getSpanX();
		
		const log10 = Math.log10(spanX);
		const floor = Math.floor( log10 );
		let increment = Math.pow( 10 , floor );
		const divisions = spanX / increment;
		
		if(divisions < 2){
			increment = Math.pow( 10 , floor-1 );
		}
		
		const minX = Math.floor(getMinX() / increment) * increment;
		const maxX = getMaxX();
		
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
		
		const y1 = getMinY();
		const y2 = getMaxY();
		
		const pixelX = getPixelX(x);
		const pixelY1 = getPixelY(y1);
		const pixelY2 = getPixelY(y2);
		
		let strokeWidth = 1;
		if( x === 0 ){
			strokeWidth = 2;
		}
		
		
		const pixelFontSize = 10;
		const textPixelX = pixelX + 2;
		const textPixelY = 8;
		
		return(
			<g>
				<line x1={pixelX} y1={pixelY1} x2={pixelX} y2={pixelY2} stroke="currentColor" strokeWidth={strokeWidth}/>
				
				<text x={textPixelX} y={textPixelY} fill="currentColor" fontSize={pixelFontSize}  >
					{x}
				</text>
			</g>
		);
	}
	
	function HorizontalGridlines(){
		
		const spanY = getSpanY();
		
		const log10 = Math.log10(spanY);
		const floor = Math.floor( log10 );
		let increment = Math.pow( 10 , floor );
		const divisions = spanY / increment;
		
		if(divisions < 2){
			increment = Math.pow( 10 , floor-1 );
		}
		
		const minY = Math.floor(getMinY() / increment) * increment;
		const maxY = getMaxY();
		
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
		
		const x1 = getX( 0 );
		const x2 = getX( pixelDimensions.width );
		
		const pixelY = getPixelY( y );
		const pixelX1 = getPixelX( x1 );
		const pixelX2 = getPixelX( x2 );
		
		
		let strokPixelWidth = 1;
		if( y === 0 ){
			strokPixelWidth = 2;
		}
		
		const pixelFontSize = 10;
		const textPixelX = 2;
		const textPixelY = pixelY - 3;
		
		return(
			<g>
				<line x1={pixelX1} y1={pixelY} x2={pixelX2} y2={pixelY} stroke="currentColor" strokeWidth={strokPixelWidth} />
				
				<text x={textPixelX} y={textPixelY} fill="currentColor" fontSize={pixelFontSize} >
					{y}
				</text>
			</g>
		);
	}
	
	
	
	
	
	// ========== inputs - mouse and keyboard ======================================================
	const [mousePosition, setMousePosition] = useState<Vector2|null>( null );
	
	function onMouseMove( e:any ) { 
		
		const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		const mousePoint = getPoint( mousePixel );
		
		//console.log( "mouse moved: " + mousePoint.x + "," + mousePoint.y );
		
		setMousePosition( mousePoint );
		if( props.mouseMoved ) props.mouseMoved( mousePoint );
		
	}
	function onMouseLeave( e:any ){
		
		const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		const mousePoint = getPoint( mousePixel );
		
		//console.log( "mouse left: " + mousePoint.x + "," + mousePoint.y );
		
		
		setMousePosition( null );
		
	}
	function onWheel( e:any ){
		
		const scrolledUp = e.deltaY < 0;
		const scrolledDown = e.deltaY > 0;
		
		const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		const mousePoint = getPoint( mousePixel );
		
		// console.log( "onWheel: "
		// 	+ "\n\t" + "scrolled " + (scrolledUp?"up":"down")
		// 	+ "\n\t" + "pixel: " + mousePixel.x + " , " + mousePixel.y 
		// 	+ "\n\t" + "point: " + mousePoint.x + " , " + mousePoint.y 
		// );
		
		if( scrolledUp ){
			
			zoomInAroundPoint( 1.25 , mousePoint );
		}
		
		if( scrolledDown ){
			
			zoomOutAroundPoint( 1.25 , mousePoint );
		}
		
	}
	
	function MouseCoordinates(){
		
		if( mousePosition == null ){
			return null;
		}
		
		let pixelRadius = 5;
		let pixelFontSize = 16;
		
		const mousePixel = getPixel( mousePosition );
		
		const textPixelX = mousePixel.x - 30;
		const textPixelY = mousePixel.y - 10;
		
		return(
			
			<>
				<circle cx={mousePixel.x} cy={mousePixel.y} r={pixelRadius} stroke="transparent" fill="red" />
				
				<text x={textPixelX} y={textPixelY} fill="red" fontSize={pixelFontSize} >
					{ Math.round(mousePosition.x)+" , "+Math.round(mousePosition.y)}
				</text>
			</>
		);
		
	}
	
	
	
	
	
	// ========== update - at 60pfs ======================================================
	const [time,setTime] = useState<number>( 0 );
	const [deltaTime,setDeltaTime] = useState<number>( 0 );
	
	const requestRef = useRef();
  	const previousTimeRef = useRef();
	
	
	
	const animate = time => {
		if (previousTimeRef.current != undefined) {
			const deltaTime = time - previousTimeRef.current;
			
			// if( props.update ){
			// 	props.update( deltaTime / 1000 );
			// }
				
			setTime(time/1000);
			setDeltaTime( deltaTime / 1000 );
			
		}
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	}
	
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, []); // Make sure the effect runs only once
	
	useEffect(() => {
		if( props.update ){
			props.update( deltaTime );
		}
	}, [time]); // Make sure the effect runs only once
	
	
	
	
	
	
	
	
	
	
	
	let cn = "canvas";
	if( props.className )  cn += " " + props.className;
	
	return (
		<CanvasContext.Provider value={{ getPixel , getPixelDistance , time }}>
			
			<div className={cn} ref={ targetRef }
				onMouseMove={e => onMouseMove(e)}
				// onMouseDown={e => onMouseDown(e)}
				// onMouseUp={e => onMouseUp(e)}
				// onWheel={e => onWheel(e)}
				// onMouseEnter={ e => onMouseEnter(e) }
				onMouseLeave={ e => onMouseLeave(e) }
				onWheel={e => onWheel(e)}
				>
					
				<svg viewBox={`0 0 ${pixelDimensions.width} ${pixelDimensions.height}`} >

					<text x="20" y="35" fill="currentColor">
						{pixelDimensionsText}
					</text>
					
					<Time />
					
					<Gridlines />
					{/* <MouseCoordinates /> */}
					
					{props.children}

				</svg>
				
			</div>
		</CanvasContext.Provider>
	);



}


export function Line({ p1 , p2 , pixelThickness=1 , className }: {p1:Vector2,p2:Vector2, pixelThickness?:number, className?:string}){
	
	const { getPixel } = useCanvasState();
	
	const pixel1 = getPixel( p1 );
	const pixel2 = getPixel( p2 );
	
	
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
export function Circle({ center , radius , className }: {center:Vector2, radius:number, className?:string}){
	
	const { getPixel , getPixelDistance } = useCanvasState();
	
	const pixelCenter = getPixel( center );
	const pixelRadius = getPixelDistance( radius );
	
	
	let cn = "circle";
	if( className )  cn += " " + className;
	
	return(
		<circle cx={pixelCenter.x} cy={pixelCenter.y} r={pixelRadius} stroke="transparent" fill="currentColor" className={cn} />
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
	
	const { getPixel , getPixelDistance } = useCanvasState();
	
	const startPoint = addPolar( center , radius , startingAngle );
	const endPoint = addPolar( center , radius , endingAngle );
	
	const pixelCenter = getPixel( center );
	const pixelRadius = getPixelDistance( radius );
	const pixelStart = getPixel( startPoint );
	const pixelEnd = getPixel( endPoint );
	
	
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
	
	const { getPixel } = useCanvasState();
	const pixel = getPixel( location );
	const pixelFontSize = 16;
	
	let cn = "text";
	if( className )  cn += " " + className;
	
	return(
		<text x={pixel.x} y={pixel.y} fill="currentColor" fontSize={pixelFontSize} dominantBaseline="middle" textAnchor="middle" className={cn}>
			{ text }
		</text>
	);
	
}



export function Time(){
	
	const { time } = useCanvasState();
	
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
			{getTimeString(time)}
		</text>
	);
	
	
	
	
}