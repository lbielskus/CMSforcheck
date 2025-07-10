export default function Spinner({ className = 'w-8 h-8' }) {
  return (
    <div className={`${className} animate-spin`}>
      <div className='w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full'></div>
    </div>
  );
}
