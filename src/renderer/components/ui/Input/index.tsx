import React, { forwardRef } from 'react'
import { Input as HeadlessInput } from "@headlessui/react"
import "./Input.scss";
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {};

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props}, ref) => {
    return (
        <HeadlessInput type={type} className={classNames("input", className)} {...props} ref={ref}/>
    )
});

export default Input;

