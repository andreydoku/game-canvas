
import './App.scss';
import Canvas from './components/Canvas';
import AnimationDemo from './demos/AnimationDemo';
import PolarDemo from './demos/PolarDemo';

function App() {

  return (
    <div className='app'>
		{/* <Canvas zoom={2} center={{ x:0, y:0}}>
			
		</Canvas> */}
		
		<PolarDemo />
		
		{/* <AnimationDemo /> */}
		
	</div>
  )
}

export default App
