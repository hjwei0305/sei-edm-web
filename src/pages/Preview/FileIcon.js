import React from 'react';
import { toLower } from 'lodash';
import { Avatar } from 'antd';
import { ExtIcon } from 'suid';

export default function getAvatar(file, size) {
  const { name, fileName, thumbUrl } = file;
  const nameStr = name || fileName;
  if (thumbUrl) {
    return <Avatar shape="square" size={size} src={thumbUrl} />;
  }
  const fileType = toLower(nameStr && nameStr.split('.').pop());
  switch (fileType) {
    case 'xls':
    case 'xlsx':
      return (
        <Avatar
          shape="square"
          size={size}
          icon={<ExtIcon style={{ fontSize: size }} type="excel" />}
        />
      );
    case 'doc':
    case 'docx':
      return (
        <Avatar
          shape="square"
          size={size}
          icon={<ExtIcon style={{ fontSize: size }} type="word" />}
        />
      );
    case 'ppt':
    case 'pptx':
      return (
        <Avatar
          shape="square"
          size={size}
          icon={<ExtIcon style={{ fontSize: size }} type="ppt" />}
        />
      );
    case 'pdf':
      return (
        <Avatar
          shape="square"
          size={size}
          icon={<ExtIcon style={{ fontSize: size }} type="pdf" />}
        />
      );
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return (
        <Avatar
          shape="square"
          size={size}
          icon={<ExtIcon style={{ fontSize: size }} type="image" />}
        />
      );
    default:
      return (
        <Avatar
          shape="square"
          size={size}
          icon={<ExtIcon style={{ fontSize: size }} type="file" />}
        />
      );
  }
}
