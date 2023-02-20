export default function (a, b, options) {
	if (a != b) {
		return options.fn(this);
	}
}