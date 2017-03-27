import { h } from 'hyperapp'

import { Tile, TileParams } from './tile'
import style from './tile-list.scss'

export interface ListParams {
	list: TileParams[]
}

export const List = ({ list }: ListParams) => (
	<main class={style.list}>
		{list.map(params => (
			<Tile {...params} />
		))}
	</main>
)
