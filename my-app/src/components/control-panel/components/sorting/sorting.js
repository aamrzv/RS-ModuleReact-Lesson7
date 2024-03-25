import { useContext } from 'react';
import { useState } from 'react';
import { Button } from '../../../button/button';
import styles from './sorting.module.css';
import { AppContext } from '../../../../context';

export const Sorting = () => {
	const { dispatch } = useContext(AppContext);
	const [isEnabled, setIsEnabled] = useState(false);

	const onChange = ({ target }) => {
		setIsEnabled(target.checked);
		dispatch({ type: 'SET_IS_ALPHABET_SORTING', payload: target.checked });
	};

	return (
		<Button>
			<input className={styles.checkbox} id="sorting-button" type="checkbox" checked={isEnabled} onChange={onChange} />
			<label className={styles.label} htmlFor="sorting-button">
				A&darr;
			</label>
		</Button>
	);
};
