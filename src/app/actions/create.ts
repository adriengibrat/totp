export const create = (element: HTMLElement) => {
	return { preview: element.querySelector('canvas') as HTMLCanvasElement }
}
