import { array, func, number, shape } from 'prop-types'

const Info = ({ buttonAction = () => {}, coordinates = [], mapBounds }) => {
	return (
		<div className="container">
			<div className="left">
				<div className="info">
					<p>Click UPDATE below to trigger markers coordinates change.</p>
					<button onClick={buttonAction}>UPDATE</button>
					<div>
						<h3>Current markers:</h3>
						{coordinates?.map(({ lat, lng, name }, index) => (
							<div key={index}>
								<p>{`${name} / lat: ${lat} / lng: ${lng}`}</p>
							</div>
						))}
					</div>
				</div>
				{mapBounds && (
					<div>
						{mapBounds && (
							<div className="bounds">
								<h3>Map bounds</h3>
								<p>Map bounds are used to calculate clusters.</p>
								<div>
									{mapBounds?.bounds?.map((bound, index) => {
										const name = ['SW lng', 'SW lat', 'NE lng', 'NE lat'][index]
										return <p key={index}>{`${name}: ${bound}`}</p>
									})}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
			<div className="right">
				<a href="https://github.com/giorgiabosello/google-maps-react-markers">
					<img
						src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
						alt="Github repository"
					/>
				</a>
			</div>
		</div>
	)
}

Info.propTypes = {
	buttonAction: func,
	coordinates: array,
	mapBounds: shape({
		bounds: array,
		zoom: number,
	}),
}

export default Info
