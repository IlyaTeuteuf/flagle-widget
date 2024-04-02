import { PropsWithChildren } from 'react';
import Emoji, { BaseProps } from 'react-emoji-render';

type EmojiRenderProps = PropsWithChildren<{
  [x: string]: unknown;
}>;

const EmojiRender = ({ ...rest }: EmojiRenderProps) => {
  const options: BaseProps['options'] = {
    protocol: 'https',
    baseUrl: '//cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/',
    ext: 'svg',
    size: '',
  };

  return <Emoji options={options} children={null} {...rest} />;
};

export default EmojiRender;
