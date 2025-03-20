import { ReactNode } from 'react'

type WrapperProps = {
	children: ReactNode;
};
export default function ElementWrapper({ children }: WrapperProps) {
	return (
		<div className="my-8 sm:my-10">

			{children}

		</div>
	)
}
