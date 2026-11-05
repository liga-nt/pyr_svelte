// Svelte action: on a short stage (a phone on its side) fit a slide to its area instead of
// scrolling. Put it on a wrapper whose parent is the scrolling area; the wrapper must be a
// container (container-type: inline-size) so the slide's type follows its width.
//
// The slide is laid out at a wider virtual width, so headings and columns wrap less and it gets
// shorter, then scaled so that width exactly fills the area. Wider layout first, smaller scale
// second, so the text ends up as large as it can be. Below MIN_SCALE it stops and scrolls.
// Pass `false` to switch it off (the wrapper is left untouched).
const SHORT_STAGE = 500;
const MIN_SCALE = 0.4;

export function fitToStage(node, enabled = true) {
	const area = node.parentElement;

	function reset() {
		for (const p of ['transform', 'transformOrigin', 'width', 'marginRight', 'marginBottom']) node.style[p] = '';
	}

	function update() {
		reset();
		if (!enabled || area.clientHeight > SHORT_STAGE || area.clientWidth <= area.clientHeight) return;
		const cs = getComputedStyle(area);
		const availH = area.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
		const availW = area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
		if (availH <= 0 || availW <= 0 || node.offsetHeight <= availH) return;

		// Scaled height at a given scale, with the slide laid out at availW / scale wide.
		const heightAt = (scale) => {
			node.style.width = `${availW / scale}px`;
			return node.offsetHeight * scale;
		};
		let lo = MIN_SCALE;
		let hi = 1;
		if (heightAt(lo) <= availH) {
			for (let i = 0; i < 12; i++) {
				const mid = (lo + hi) / 2;
				if (heightAt(mid) <= availH) lo = mid;
				else hi = mid;
			}
		}
		const width = availW / lo;
		node.style.width = `${width}px`;
		const height = node.offsetHeight;
		node.style.transformOrigin = 'top left';
		node.style.transform = `scale(${lo})`;
		node.style.marginRight = `${width * (lo - 1)}px`;
		node.style.marginBottom = `${height * (lo - 1)}px`;
	}

	const ro = new ResizeObserver(update);
	ro.observe(area);
	ro.observe(node);
	update();

	return {
		update(next) {
			enabled = next;
			update();
		},
		destroy: () => ro.disconnect()
	};
}
