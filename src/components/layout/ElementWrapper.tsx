import { ReactNode } from 'react'


type WrapperProps = {
	children: ReactNode;
	spacing?: 'default' | 'large';
};
export default function ElementWrapper({ children, spacing }: WrapperProps) {
	const cls = spacing === 'large' ? 'my-12 sm:my-16' : 'my-8 sm:my-10'
	return (
		<div className={cls}>

			{children}

		</div>
	)
}
