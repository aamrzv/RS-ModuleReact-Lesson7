import { useContext } from 'react';
import { useRef, useState } from 'react';
import { debounce } from './utils';
import styles from './search.module.css';
import { AppContext } from '../../../../context';

export const Search = () => {
	const [value, setValue] = useState('');
	const { dispatch } = useContext(AppContext);
	const debouncedOnSearch = useRef(debounce(dispatch, 1500)).current;

	const onChange = ({ target }) => {
		setValue(target.value);
		debouncedOnSearch({ type: 'SET_SEARCH_PHRASE', payload: target.value });
	};

	const onSubmit = (event) => {
		event.preventDefault();
		dispatch({ type: 'SET_SEARCH_PHRASE', payload: value });
	};

	return (
		<form className={styles.search} onSubmit={onSubmit}>
			<input className={styles.input} type="text" value={value} placeholder="Поиск..." onChange={onChange} />
		</form>
	);
};
