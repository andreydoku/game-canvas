import { Vector2 } from "../components/Vector2";

export class CanvasClass{
	pixelDimensions:{width:number,height:number} = {
		width: 0,
		height: 0
	}
	getPixelCenter(): Vector2{
		
		return {
			x: this.pixelDimensions.width/2,
			y: this.pixelDimensions.height/2,
		}
		
	}
	repaint(){
		
	}
	
	
	//=========================================================
	
	center: Vector2;
	zoom: number;
	constructor( center:Vector2 , zoom:number){
		this.center = center;
		this.zoom = zoom;
		//console.log("called constructor");
		
		
	}
	
	getPoint( pixel:Vector2 ): Vector2{
		
		if( this.center == null ){
			return { x:0 , y:0 };
		}
		
		return { 
			x: this.center.x + ( pixel.x - this.getPixelCenter().x ) / this.zoom,
			y: this.center.y - ( pixel.y - this.getPixelCenter().y ) / this.zoom
		}
		
	}
	getPixel( p: Vector2 ): Vector2{
		
		if( this.center == null ){
			return { x:0 , y:0 };
		}
		
		return {
			x: this.zoom *(p.x-this.center.x) + this.getPixelCenter().x,
			y: -this.zoom *(p.y-this.center.y) + this.getPixelCenter().y
		}
		
		
	}
	
	getPixelDistance( distance:number ): number{
		
		return distance * this.zoom;
		
	}
	getDistance( pixelDistance: number ): number{
		
		return ( pixelDistance ) / this.zoom;
		
	}
	
	
	getMin(): Vector2{
		
		//bottom-left pixel
		const minPixel = { 
			x: 0,
			y: this.pixelDimensions.height 
		};
		
		return this.getPoint( minPixel );
	}
	getMax() : Vector2{
		
		//top-right pixel
		const maxPixel = { 
			x: this.pixelDimensions.width,
			y: 0 
		};
		
		return this.getPoint( maxPixel );
	}
	getSpan(){
		
		return {
			width: this.pixelDimensions.width/ this.zoom,
			height: this.pixelDimensions.height/ this.zoom
		}
	}
	
	movePointToPixel( point:Vector2 , pixel:Vector2 ): void {
		
		this.center = { 
			x: point.x - ( pixel.x - this.getPixelCenter().x ) / this.zoom,
			y: point.y + ( pixel.y - this.getPixelCenter().y ) / this.zoom
		}
		
		this.repaint();
		
	}
	
	
	//=========================================================
	
	mousePosition: Vector2|null = null;
	mousePressedPosition: Vector2|null = null;
	
	dragPosition: Vector2|null = null;
	
	isMousePressed(){
		return this.mousePressedPosition != null;
	}
	
	
	onMouseMove( e:any ) {
		const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		const mousePoint = this.getPoint( mousePixel );
		//console.log( "mouse moved: " + mousePoint.x + " , " + mousePoint.y );
		
		this.mousePosition = mousePoint;
		
		//console.log( "mouse moved" + "\n\t" + "isMousePressed: " + this.isMousePressed() );
		
		
		if( this.isMousePressed() && this.mousePressedPosition ){
			//console.log( "mouse dragged: " + mousePoint.x + " , " + mousePoint.y );
			this.dragPosition = this.mousePosition;
			this.mouseDragged( this.mousePressedPosition , this.mousePosition );
			this.repaint();
		}
		
		
		this.mouseMoved( this.mousePosition );
		this.repaint();
		
		
	}
	onMouseLeave( e:any ){
		
		//const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		//const mousePoint = this.getPoint( mousePixel );
		
		//console.log( "mouse left: " + mousePoint.x + "," + mousePoint.y );
		
		
		this.mousePosition = null;
		this.mouseMoved( null );
		this.repaint();
		
	}
	
	onMouseDown( e:any ){
		const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		const mousePoint = this.getPoint( mousePixel );
		
		//console.log("mouse down: " + mousePoint.x + " , " + mousePoint.y);
		this.mousePressed( mousePoint );
		
		
		this.mousePressedPosition = mousePoint;
	}
	onMouseUp( e:any ){
		const mousePixel = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
		const mousePoint = this.getPoint( mousePixel );
		
		this.mousePressedPosition = null;
	}
	
	//callbacks
	mouseMoved( p: Vector2|null ){}
	mouseDragged( dragStart:Vector2 , dragPosition:Vector2 ){
		
		//console.log("mouseDragged   from " + dragStart.x + "," + dragStart.y + "   " + "to " + dragPosition.x + "," + dragPosition.y);
		const dragPixel = this.getPixel( dragPosition );
		this.movePointToPixel( dragStart , dragPixel );
		
	}
	mousePressed( p: Vector2|null ){}
	
	
	//=========================================================
	
	time: number = 0;
	oldTimestamp: number = 0;
	tick(){
		//console.log("tick");
		const newTimestamp = Date.now();
		
		const deltaT = (newTimestamp - this.oldTimestamp) / 1000;
		this.time += deltaT;
		this.oldTimestamp = newTimestamp;
		
		
		this.update( deltaT );
		this.repaint();
	}
	start(){
		this.time = 0;
		this.oldTimestamp = Date.now();
		setInterval( this.tick.bind(this) , 1000/60 );
	}
	update( deltaT:number ){
		
	}
	
	
}