import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './ExtAction.less';

const { getUUID } = utils;
const { OCR_SERVICE_BTN_KEY } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: '编辑',
    key: OCR_SERVICE_BTN_KEY.EDIT,
    disabled: false,
  },
  {
    title: '删除',
    key: OCR_SERVICE_BTN_KEY.DELETE,
    disabled: false,
  },
  {
    title: '停用',
    key: OCR_SERVICE_BTN_KEY.FROZEN,
    disabled: true,
  },
  {
    title: '启用',
    key: OCR_SERVICE_BTN_KEY.ACTIVE,
    disabled: true,
  },
];

class ExtAction extends PureComponent {
  static propTypes = {
    recordItem: PropTypes.object,
    onAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: '',
      menusData: [],
    };
  }

  componentDidMount() {
    this.initActionMenus();
  }

  componentDidUpdate(prevProps) {
    const { recordItem } = this.props;
    if (!isEqual(prevProps.recordItem, recordItem)) {
      this.initActionMenus();
    }
  }

  initActionMenus = () => {
    const { recordItem } = this.props;
    const menus = menuData();
    menus.forEach(m => {
      /** 启用 */
      if (recordItem.frozen && m.key === OCR_SERVICE_BTN_KEY.ACTIVE) {
        Object.assign(m, { disabled: false });
      }
      /** 停用 */
      if (recordItem.frozen === false && m.key === OCR_SERVICE_BTN_KEY.FROZEN) {
        Object.assign(m, { disabled: false });
      }
    });

    this.setState({
      menusData: menus.filter(m => !m.disabled),
    });
  };

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    this.setState({
      selectedKeys: '',
      menuShow: false,
    });
    const { onAction, recordItem } = this.props;
    if (onAction) {
      onAction(e.key, recordItem);
    }
  };

  getMenu = (menus, recordItem) => {
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e, recordItem)}
      >
        {menus.map(m => {
          return (
            <Item key={m.key}>
              <span className="menu-title">{m.title}</span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      menuShow: v,
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  render() {
    const { recordItem } = this.props;
    const { menuShow, menusData } = this.state;
    return (
      <>
        {menusData.length > 0 ? (
          <Dropdown
            trigger={['click']}
            overlay={this.getMenu(menusData, recordItem)}
            className="action-drop-down"
            placement="bottomLeft"
            visible={menuShow}
            onVisibleChange={this.onVisibleChange}
          >
            <ExtIcon className={cls('action-item')} type="more" antd />
          </Dropdown>
        ) : null}
      </>
    );
  }
}

export default ExtAction;
