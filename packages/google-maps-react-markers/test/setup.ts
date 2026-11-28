import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { resetLoaderForTests } from '../src/loader'
import { uninstallGoogleMapsMock } from './google-maps-mock'

afterEach(() => {
	cleanup()
	resetLoaderForTests()
	uninstallGoogleMapsMock()
})
