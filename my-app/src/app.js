import { useEffect, useState } from 'react';
import { ControlPanel, Todo } from './components';
import { createTodo, readTodos, updateTodo, deleteTodo } from './api';
import { addTodoInTodos, findTodo, removeTodoInTodos, setTodoInTodos } from './utils';
import { NEW_TODO_ID } from './constants';
import styles from './app.module.css';
import { AppContext } from './context.js';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isAlphabetSorting, setIsAlphabetSorting] = useState(false);

	const onTodoAdd = () => {
		setTodos(addTodoInTodos(todos));
	};

	const onTodoSave = (todoId) => {
		const { title, completed } = findTodo(todos, todoId) || {};

		if (todoId === NEW_TODO_ID) {
			createTodo({ title, completed }).then((todo) => {
				let updatedTodos = setTodoInTodos(todos, {
					id: NEW_TODO_ID,
					isEditing: false,
				});
				updatedTodos = removeTodoInTodos(updatedTodos, NEW_TODO_ID);
				updatedTodos = addTodoInTodos(updatedTodos, todo);
				setTodos(updatedTodos);
			});
		} else {
			updateTodo({ id: todoId, title }).then(() => {
				setTodos(setTodoInTodos(todos, { id: todoId, isEditing: false }));
			});
		}
	};

	const onTodoEdit = (id) => {
		setTodos(setTodoInTodos(todos, { id, isEditing: true }));
	};

	const onTodoTitleChange = (id, newTitle) => {
		setTodos(setTodoInTodos(todos, { id, title: newTitle }));
	};

	const onTodoCompletedChange = (id, newCompleted) => {
		updateTodo({ id, completed: newCompleted }).then(() => {
			setTodos(setTodoInTodos(todos, { id, completed: newCompleted }));
		});
	};

	const onTodoRemove = (id) => {
		deleteTodo(id).then(() => setTodos(removeTodoInTodos(todos, id)));
	};

	useEffect(() => {
		readTodos(searchPhrase, isAlphabetSorting).then((loadedTodos) => {
			console.log(loadedTodos);
			setTodos(loadedTodos);
		});
	}, [searchPhrase, isAlphabetSorting]);

	const dispatch = (action) => {
		const { type, payload } = action;

		switch (type) {
			case 'SET_SEARCH_PHRASE': {
				setSearchPhrase(payload);
				break;
			}
			case 'SET_IS_ALPHABET_SORTING': {
				setIsAlphabetSorting(payload);
				break;
			}
			default:
			// ничего не делать
		}
	};

	return (
		<AppContext.Provider value={{ dispatch }}>
			<div className={styles.app}>
				<ControlPanel onTodoAdd={onTodoAdd} />
				<div>
					{todos.map(({ id, title, completed, isEditing = false }) => (
						<Todo
							key={id}
							id={id}
							title={title}
							completed={completed}
							isEditing={isEditing}
							onEdit={() => onTodoEdit(id)}
							onTitleChange={(newTitle) => onTodoTitleChange(id, newTitle)}
							onCompletedChange={(newCompleted) => onTodoCompletedChange(id, newCompleted)}
							onSave={() => onTodoSave(id)}
							onRemove={() => onTodoRemove(id)}
						/>
					))}
				</div>
			</div>
		</AppContext.Provider>
	);
};
