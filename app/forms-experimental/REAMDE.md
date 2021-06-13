# Forms

Custom solution for forms in React. It is inspired by [React Hook Form](https://react-hook-form.com/).

The main goals of this custom solution are:
* performance (eliminate unnecessary re-renders)
* leverage native HTML5 forms possibilities (validation, ...)
* dynamic declarative fields registration and de-registration
* make values of all fields available in `onSubmit` handler


## Usage example

`LoginPage.tsx`:
```tsx
// imports ...

interface LoginState {
	loading: boolean;
	message?: [MessageId, any];
}

const LoginPage = () => {

	const t = useFormatMessageIdAsTagFn();

	const [state, setState] = useState<LoginState>({ loading: false });

	useDocumentTitle(t`titles.login`);

	const handleSubmit = useCallback(values => {

		console.log(`[LoginPage][handleSubmit]`, values);

		setState({ loading: true });

		login('https://some-login-api.com/login', values)
			.then(({ json }) => {

				setAuth(json);

				// TODO: redirect ...

			})
			.catch(err => {

				if (err instanceof Error) {
					setState({
						loading: false,
						message: [`loginPage.errors.unknown`, { message: err?.message }],
					});
					return;
				}

				const { json } = err;

				setState({
					loading: false,
					message: [`loginPage.errors.${json?.code ?? 'unknown'}`, { message: json?.message }],
				});

			});

	}, [setState]);

	return (
		<Form
			name="login"
			className={classNames({
				'login-form': true,
				'submitting': submitting,
				'submit-failed': submitFailed,
			})}
			onSubmit={onSubmit}
		>
			
			<div className="login-form-body">

				{message && <p className="help-block error-block">{t(...message)}</p>}

				<FormInput
					name="email"
					label="loginForm.labels.email"
					type="email"
					autoComplete="email"
					required={true}
				/>

				<FormInput
					name="password"
					label="loginForm.labels.password"
					type="password"
					autoComplete="current-password"
					required={true}
				/>

			</div>

			{!submitting
				?
				<Button
					type="submit"
					name="submit"
					style="success"
					className="btn-login"
				>
					<span>
						{t('loginForm.login')}
						<i className="btn-login-icon fa fa-angle-double-right" />
					</span>
				</Button>
				:
				<Button
					disabled={true}
					type="submit"
					name="submit"
					className="btn-success btn-login"
				>
					<span>{t('loginForm.loading')}</span>
				</Button>
			}

		</Form>
	);

};
```

## Resources

* **React Hook Form**
	* 🌐 [web](https://react-hook-form.com/)
	* 📙 [GitHub](https://github.com/react-hook-form/react-hook-form)
* **Redux Form**
	* 🌐 [web](https://redux-form.com/)
	* 📙 [GitHub](https://github.com/redux-form/redux-form)
* **Formik**
	* 🌐 [web](https://formik.org/)
	* 📙 [GitHub](https://github.com/formium/formik)
* https://stackoverflow.com/questions/3294572/is-input-well-formed-without-a-form
* https://stackoverflow.com/questions/12651114/is-it-valid-to-put-a-period-in-the-name-attribute-of-a-html5-input
* https://www.apollographql.com/blog/full-stack-error-handling-with-graphql-apollo-5c12da407210/
