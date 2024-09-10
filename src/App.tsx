
import './App.scss';
import Box2dCanvas from './components/Box2dCanvas';
import Canvas from './components/Canvas';
import AnimationDemo from './demos/AnimationDemo';
import Box2dCanvasDemo from './demos/Box2dCanvasDemo';
import PolarDemo from './demos/PolarDemo';

function App() {

  return (
    <div className='app'>
		{/* <Canvas zoom={2} center={{ x:0, y:0}}>
			
		</Canvas> */}
		
		{/* <PolarDemo /> */}
		
		{/* <AnimationDemo /> */}
		
		<Box2dCanvasDemo />
		
	</div>
  )
}

export default App
