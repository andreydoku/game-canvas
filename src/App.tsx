
import './App.scss';
import Box2dCanvas from './components/Box2dCanvas';
import Canvas from './components/Canvas';
import AnimationDemo from './demos/AnimationDemo';
import Box2dCanvasDemo from './demos/Box2dCanvasDemo';
import PolarDemo from './demos/PolarDemo';
import Box2dCanvasDemo2 from './v2/Box2dCanvasDemo2';
import Canvas2 from './v2/Canvas2';
import { CanvasClass } from './v2/CanvasClass';
import PolarDemo2 from './v2/PolarDemo2';

function App() {

  return (
    <div className='app'>
		{/* <Canvas zoom={2} center={{ x:0, y:0}}>
			
		</Canvas> */}
		
		{/* <PolarDemo /> */}
		
		{/* <AnimationDemo /> */}
		
		{/* <Box2dCanvasDemo /> */}
		
		{/* <Canvas2 canvasClass={new CanvasClass({x: 0,y: 0},2)} /> */}
		
		{/* <PolarDemo2 /> */}
		<Box2dCanvasDemo2 />
		
	</div>
  )
}

export default App
