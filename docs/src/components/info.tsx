import styles from '../app/page.module.css'

interface InfoProps {
	bounds?: number[]
	buttonAction?: () => void
	coordinates?: { lat: number; lng: number; name: string }[]
	drag?: {
		dragEnd: { lat: number; lng: number } | null
		dragStart: { lat: number; lng: number } | null
		dragging: { lat: number; lng: number } | null
	}
}

const Info = ({ buttonAction = () => {}, coordinates = [], bounds, drag }: InfoProps) => (
	<div className={styles.container}>
		<div className={styles.info}>
			<div>
				<h3>📍 Current markers</h3>
				{coordinates?.map(({ lat, lng, name }, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index}>
						<p>{`${name} 👉 { lat: ${lat},lng: ${lng} }`}</p>
					</div>
				))}
			</div>
			<div>
				<h3>🖐🏼 Drag</h3>
				<p>Drag the blue marker to see its coordinates change.</p>
				{drag?.dragStart && drag?.dragEnd && (
					<>
						<p>Drag start:</p>
						<p>{drag.dragStart ? `lat: ${drag.dragStart.lat}, lng: ${drag.dragStart.lng}` : 'null'}</p>
						<p>Dragging:</p>
						<p>{drag.dragging ? `lat: ${drag.dragging.lat}, lng: ${drag.dragging.lng}` : 'null'}</p>
						<p>Drag end:</p>
						<p>{drag.dragEnd ? `lat: ${drag.dragEnd.lat}, lng: ${drag.dragEnd.lng}` : 'null'}</p>
					</>
				)}
			</div>
		</div>
		{bounds && (
			<div className={styles.bounds}>
				<h3>🗺 Map bounds</h3>
				<p>Map bounds are used to calculate clusters.</p>
				<p>Move the map to see the bounds change.</p>
				<div>
					{bounds?.map((bound: number, index: number) => {
						const name = ['SW lng', 'SW lat', 'NE lng', 'NE lat'][index]
						// eslint-disable-next-line react/no-array-index-key
						return <p key={index}>{`${name}: ${bound}`}</p>
					})}
				</div>
			</div>
		)}
		<div className={styles.buttonContainer}>
			<p>Click UPDATE below to trigger markers coordinates change.</p>
			<p>Or move the map to trigger bounds change.</p>
			<button className={styles.action} type="button" onClick={buttonAction}>
				UPDATE
			</button>
		</div>
	</div>
)

export default Info
