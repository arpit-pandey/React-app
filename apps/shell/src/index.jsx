
import('./App').then(({ default: App }) => {
	Promise.all([
		import('react'),
		import('react-dom/client')
	]).then(([React, { createRoot }]) => {
		const root = createRoot(document.getElementById('root'));
		root.render(<App />);
	});
});

