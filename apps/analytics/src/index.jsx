
import('./App').then(({ default: AnalyticsDashboard }) => {
	Promise.all([
		import('react'),
		import('react-dom/client')
	]).then(([React, { createRoot }]) => {
		const container = document.getElementById('root');
		const root = createRoot(container);
		root.render(<AnalyticsDashboard />);
	});
});
