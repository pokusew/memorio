# Simple State Management

A simple custom solution for global state management in React.


## Resources


### Subscribing to external state changes in React


* https://github.com/facebook/react/tree/master/packages/use-subscription
* SEE https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
* https://github.com/facebook/react/tree/master/packages/create-subscription
* https://github.com/facebook/react/issues/13186#issuecomment-403959161
* https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#adding-event-listeners-or-subscriptions
* https://github.com/facebook/react/issues/14988


    As for fixing the original issue, the strategy is to read the mutable value in useEffect.
    If it changed since the value captured during render, setState.
    
    https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
    
    How do I implement getDerivedStateFromProps?
    While you probably don’t need it, in rare cases that you do (such as implementing a <Transition> component), you can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn’t be expensive.
    
    >>> update the state right during rendering <<<
    
    about ref api https://github.com/react-hook-form/react-hook-form/issues/26
    
    REALLY SEE https://github.com/facebook/react/issues/15176
    
    effects run from bottom to top - when destroying nodes, then opposite
