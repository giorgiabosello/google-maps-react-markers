import styles from '../app/page.module.css'

interface InfoProps {
	bounds?: number[]
	buttonAction?: () => void
	coordinates?: { lat: number; lng: number; name: string }[]
}

const Info = ({ buttonAction = () => {}, coordinates = [], bounds }: InfoProps) => (
	<div className={styles.container}>
		<div className="info">
			<p>Click UPDATE below to trigger markers coordinates change.</p>
			<button className={styles.action} type="button" onClick={buttonAction}>
				UPDATE
			</button>
			<div>
				<h3>Current markers:</h3>
				{coordinates?.map(({ lat, lng, name }, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index}>
						<p>{`${name} / lat: ${lat} / lng: ${lng}`}</p>
					</div>
				))}
			</div>
		</div>
		{bounds && (
			<div className="bounds">
				<h3>Map bounds</h3>
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
	</div>
)

export default Info
