export default function (...args) {
	// Remove options object
	return new args.slice(0, -1).join('');
}