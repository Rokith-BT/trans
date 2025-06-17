import React from 'react';

// Define the type for the HOC props
interface WithVisibilityProps {
  isVisible: boolean | undefined;
}

// HOC that shows or hides the wrapped component based on a boolean prop
export const withVisibility = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component<P & WithVisibilityProps> {
    render() {
      const { isVisible, ...otherProps } = this.props;

      if (!isVisible) {
        return null;
      }

      return <WrappedComponent {...(otherProps as P)} />;
    }
  };
};

// Example on How to use it.

// // Define the props for MyComponent
// interface MyComponentProps {
//   content: string;
// }

// // Example usage
// const MyComponent: React.FC<MyComponentProps> = (props) => {
//   return <div>{props.content}</div>;
// };

// // Wrapped component with visibility control
// const MyComponentWithVisibility = withVisibility(MyComponent);

// // App component
// const App: React.FC = () => {
//   return (
//     <div>
//       <MyComponentWithVisibility isVisible={true} content="This is visible" />
//       <MyComponentWithVisibility isVisible={false} content="This is hidden" />
//     </div>
//   );
// };

// export default App;
