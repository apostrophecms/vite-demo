/* eslint-disable no-unused-vars */
import {
  useState, useCallback, StrictMode,
  useMemo
} from 'react';
/* eslint-enable no-unused-vars */

// Assets
import viteLogo from '@/asset/svg/vite.svg';
import reactLogo from './assets/react.svg';

function App({
  id, widget, options
}) {

  // Vanilla React is a mess...
  const [ count, setCount ] = useState(widget.counter?.count || 0);
  const [ debugState, setDebugState ] = useState(false);
  const [ message, setMessage ] = useState('');

  // Optimize the callbacks, it's a demo but why not?
  const onClick = useCallback(() => {
    setMessage('');

    apos.http
      .post('/api/v1/counter/count', {
        body: {
          type: widget.type,
          id: widget._id,
          count: count + 1
        }
      })
      .then(console.log)
      .catch((err) => setMessage(err.body?.data?.message || 'Server Error'));

    setCount((count) => count + 1);
  }, [ count ]);

  const onDebugClick = useCallback(() => {
    setDebugState((debugState) => !debugState);
  }, [ debugState ]);

  // Optimized data, it never changes (comming from the server as props).
  const { debug, title } = useMemo(() => {
    return {
      title: widget.title,
      debug: JSON.stringify({
        id,
        widget,
        options
      }, null, 2)
    };
  }, []);

  const debugLabel = debugState ? 'Hide Debug' : 'Show Debug';

  return (
    <StrictMode>
      <div className='py-8'>
        <div className='flex justify-center content-center'>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            {/* Use imported svg from another module */}
            <img src={viteLogo} className="logo" alt="Vite Logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            {/* ...or from the same module */}
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        {/* Title from the widget data */}
        <h2 class="text-5xl">{title}</h2>

        {/* A server error message will appear here */}
        {message && <p className="mt-4 p-4 bg-red-400">[Server Message] {message}</p>}

        {/* The Button. No tailwind CSS because we grab it directly
        from the vite template installs. */}
        <div className="card">
          <button className='cbutton' onClick={onClick}>
          count is {count}
          </button>
        </div>

        {/* A toggle for debugging - show App props (coming from the server) */}
        <h4 className='text-center mb-4 text-xl'>
          <button onClick={onDebugClick}>
            {debugLabel}
          </button>
        </h4>
        <div className='text-center' style={{ display: debugState ? 'block' : 'none' }}>
          <pre className='m-auto'>
            {debug}
          </pre>
        </div>
      </div>
    </StrictMode>
  );
}

export default App;
