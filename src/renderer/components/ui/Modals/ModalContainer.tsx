import classNames from 'classnames'
import React from 'react'
import { DialogBackdrop } from '@headlessui/react'

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {};

const ModalContainer = ({className, children, ...props}: DivProps) => {
    return (
        <>
            <DialogBackdrop className="modal-backdrop"/>
            <div className={classNames('modal-container', className)} {...props}>{children}</div>
        </>
    )
}

export default ModalContainer;
