import { history, useLocation} from 'umi'
import React from 'react';

export type AuthWrapperProps = {
  children?: React.ReactNode,
}
export default ({ children }: AuthWrapperProps) => {
 
  if (isLogin) {
    return <div>{children}</div>;
  } else {
    history.push('/login');
  }
}