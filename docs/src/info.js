import { array, func } from 'prop-types'

const Info = ({ buttonAction, coordinates }) => {
	return (
		<div className="container">
			<div>
				<p>Map is ready. See for logs in developer console.</p>
				<p>Click UPDATE below to trigger markers coordinates change.</p>
				<button onClick={buttonAction}>UPDATE</button>
				<div>
					<p>Current coordinates:</p>
					{coordinates?.map(({ lat, lng, name }, index) => (
						<div key={index}>
							{name} - {lat}, {lng}
						</div>
					))}
				</div>
			</div>
			<div>
				<a href="https://github.com/giorgiabosello/google-maps-react-markers" style={{ display: 'block' }}>
					<img
						src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
						alt="Github repository"
					/>
				</a>
			</div>
		</div>
	)
}

Info.defaultProps = {
	buttonAction: () => {},
	coordinates: [],
}

Info.propTypes = {
	buttonAction: func,
	coordinates: array,
}

export default Info
