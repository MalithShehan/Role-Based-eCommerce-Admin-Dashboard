(function (React, adminjs, designSystem) {
    'use strict';

    function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

    var React__default = /*#__PURE__*/_interopDefault(React);

    const api$1 = new adminjs.ApiClient();
    const statusColors = {
      pending: '#F6AD55',
      processing: '#63B3ED',
      shipped: '#9F7AEA',
      delivered: '#68D391',
      cancelled: '#FC8181'
    };
    const Card = ({
      title,
      value,
      color,
      icon
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bg: "white",
      p: "xl",
      mr: "lg",
      mb: "lg",
      style: {
        borderRadius: 12,
        minWidth: 200,
        flex: '1 1 200px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderLeft: `4px solid ${color || '#3B82F6'}`
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      color: "grey60",
      mb: "sm",
      style: {
        textTransform: 'uppercase',
        letterSpacing: 1
      }
    }, title), /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
      style: {
        color: color || '#1E293B',
        margin: 0
      }
    }, value));
    const StatusBadge = ({
      status
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      px: "md",
      py: "xs",
      style: {
        borderRadius: 20,
        backgroundColor: statusColors[status] || '#A0AEC0',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        display: 'inline-block',
        textTransform: 'capitalize'
      }
    }, status);
    const Dashboard = () => {
      const [data, setData] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      React.useEffect(() => {
        api$1.getDashboard().then(response => {
          setData(response.data);
          setLoading(false);
        }).catch(err => {
          console.error('Dashboard error:', err);
          setLoading(false);
        });
      }, []);
      if (loading) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          flex: true,
          justifyContent: "center",
          alignItems: "center",
          style: {
            minHeight: 400
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          fontSize: "lg",
          color: "grey60"
        }, "Loading dashboard..."));
      }
      if (!data) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "xxl"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.MessageBox, {
          variant: "danger",
          message: "Failed to load dashboard data."
        }));
      }

      // ADMIN DASHBOARD
      if (data.role === 'admin') {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "xxl",
          style: {
            background: '#F8FAFC',
            minHeight: '100vh'
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          mb: "xxl"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          style: {
            color: '#1E293B',
            marginBottom: 4
          }
        }, data.message), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey60",
          fontSize: "md"
        }, "Here is your store overview")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          flex: true,
          flexWrap: "wrap",
          mb: "xxl"
        }, /*#__PURE__*/React__default.default.createElement(Card, {
          title: "Total Users",
          value: data.stats.totalUsers,
          color: "#3B82F6"
        }), /*#__PURE__*/React__default.default.createElement(Card, {
          title: "Total Products",
          value: data.stats.totalProducts,
          color: "#8B5CF6"
        }), /*#__PURE__*/React__default.default.createElement(Card, {
          title: "Total Categories",
          value: data.stats.totalCategories,
          color: "#06B6D4"
        }), /*#__PURE__*/React__default.default.createElement(Card, {
          title: "Total Orders",
          value: data.stats.totalOrders,
          color: "#F59E0B"
        }), /*#__PURE__*/React__default.default.createElement(Card, {
          title: "Total Revenue",
          value: `$${data.stats.totalRevenue}`,
          color: "#10B981"
        })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          bg: "white",
          p: "xl",
          mb: "xxl",
          style: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
          style: {
            marginBottom: 16,
            color: '#1E293B'
          }
        }, "Orders by Status"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          flex: true,
          flexWrap: "wrap"
        }, data.ordersByStatus && data.ordersByStatus.map(item => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          key: item.status,
          flex: true,
          flexDirection: "column",
          alignItems: "center",
          p: "lg",
          mr: "lg",
          mb: "sm",
          style: {
            borderRadius: 8,
            background: '#F8FAFC',
            minWidth: 120
          }
        }, /*#__PURE__*/React__default.default.createElement(StatusBadge, {
          status: item.status
        }), /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
          style: {
            margin: '8px 0 0',
            color: '#1E293B'
          }
        }, item.count))))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          bg: "white",
          p: "xl",
          style: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
          style: {
            marginBottom: 16,
            color: '#1E293B'
          }
        }, "Recent Orders"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          style: {
            overflowX: 'auto'
          }
        }, /*#__PURE__*/React__default.default.createElement("table", {
          style: {
            width: '100%',
            borderCollapse: 'collapse'
          }
        }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", {
          style: {
            borderBottom: '2px solid #E2E8F0'
          }
        }, /*#__PURE__*/React__default.default.createElement("th", {
          style: thStyle$1
        }, "Order ID"), /*#__PURE__*/React__default.default.createElement("th", {
          style: thStyle$1
        }, "Customer"), /*#__PURE__*/React__default.default.createElement("th", {
          style: thStyle$1
        }, "Amount"), /*#__PURE__*/React__default.default.createElement("th", {
          style: thStyle$1
        }, "Status"), /*#__PURE__*/React__default.default.createElement("th", {
          style: thStyle$1
        }, "Date"))), /*#__PURE__*/React__default.default.createElement("tbody", null, data.recentOrders && data.recentOrders.map(order => /*#__PURE__*/React__default.default.createElement("tr", {
          key: order.id,
          style: {
            borderBottom: '1px solid #F1F5F9'
          }
        }, /*#__PURE__*/React__default.default.createElement("td", {
          style: tdStyle$1
        }, "#", order.id), /*#__PURE__*/React__default.default.createElement("td", {
          style: tdStyle$1
        }, order.userName), /*#__PURE__*/React__default.default.createElement("td", {
          style: tdStyle$1
        }, "$", order.totalAmount), /*#__PURE__*/React__default.default.createElement("td", {
          style: tdStyle$1
        }, /*#__PURE__*/React__default.default.createElement(StatusBadge, {
          status: order.status
        })), /*#__PURE__*/React__default.default.createElement("td", {
          style: tdStyle$1
        }, new Date(order.createdAt).toLocaleDateString()))))))));
      }

      // REGULAR USER DASHBOARD
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "xxl",
        style: {
          background: '#F8FAFC',
          minHeight: '100vh'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mb: "xxl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
        style: {
          color: '#1E293B',
          marginBottom: 4
        }
      }, data.message), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        color: "grey60",
        fontSize: "md"
      }, "Here is your account summary")), data.personalInfo && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        bg: "white",
        p: "xl",
        mb: "xxl",
        style: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
        style: {
          marginBottom: 16,
          color: '#1E293B'
        }
      }, "Personal Information"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        flex: true,
        flexWrap: "wrap"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mr: "xxl",
        mb: "md"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        fontSize: "sm",
        color: "grey60",
        style: {
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 4
        }
      }, "Name"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        style: {
          fontWeight: 600,
          fontSize: 16,
          color: '#1E293B'
        }
      }, data.personalInfo.name)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mr: "xxl",
        mb: "md"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        fontSize: "sm",
        color: "grey60",
        style: {
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 4
        }
      }, "Email"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        style: {
          fontWeight: 600,
          fontSize: 16,
          color: '#1E293B'
        }
      }, data.personalInfo.email)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mr: "xxl",
        mb: "md"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        fontSize: "sm",
        color: "grey60",
        style: {
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 4
        }
      }, "Role"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        px: "md",
        py: "xs",
        style: {
          borderRadius: 20,
          backgroundColor: '#EEF2FF',
          color: '#4338CA',
          fontSize: 13,
          fontWeight: 600,
          display: 'inline-block',
          textTransform: 'capitalize'
        }
      }, data.personalInfo.role)))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        flex: true,
        flexWrap: "wrap",
        mb: "xxl"
      }, /*#__PURE__*/React__default.default.createElement(Card, {
        title: "Your Orders",
        value: data.stats.totalOrders,
        color: "#3B82F6"
      }), /*#__PURE__*/React__default.default.createElement(Card, {
        title: "Total Spent",
        value: `$${data.stats.totalSpent}`,
        color: "#10B981"
      })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        bg: "white",
        p: "xl",
        style: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
        style: {
          marginBottom: 16,
          color: '#1E293B'
        }
      }, "Your Recent Orders"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        style: {
          overflowX: 'auto'
        }
      }, /*#__PURE__*/React__default.default.createElement("table", {
        style: {
          width: '100%',
          borderCollapse: 'collapse'
        }
      }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", {
        style: {
          borderBottom: '2px solid #E2E8F0'
        }
      }, /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle$1
      }, "Order ID"), /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle$1
      }, "Amount"), /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle$1
      }, "Status"), /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle$1
      }, "Date"))), /*#__PURE__*/React__default.default.createElement("tbody", null, data.recentOrders && data.recentOrders.map(order => /*#__PURE__*/React__default.default.createElement("tr", {
        key: order.id,
        style: {
          borderBottom: '1px solid #F1F5F9'
        }
      }, /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle$1
      }, "#", order.id), /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle$1
      }, "$", order.totalAmount), /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle$1
      }, /*#__PURE__*/React__default.default.createElement(StatusBadge, {
        status: order.status
      })), /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle$1
      }, new Date(order.createdAt).toLocaleDateString()))))))));
    };
    const thStyle$1 = {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: 13,
      fontWeight: 600,
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };
    const tdStyle$1 = {
      padding: '12px 16px',
      fontSize: 14,
      color: '#334155'
    };

    const api = new adminjs.ApiClient();
    const Settings = () => {
      const [settings, setSettings] = React.useState([]);
      const [loading, setLoading] = React.useState(true);
      const [saving, setSaving] = React.useState(null);
      const [editValues, setEditValues] = React.useState({});
      const [message, setMessage] = React.useState(null);
      const [editingId, setEditingId] = React.useState(null);
      const fetchSettings = () => {
        setLoading(true);
        api.getPage({
          pageName: 'Settings'
        }).then(response => {
          setSettings(response.data.settings || []);
          setLoading(false);
        }).catch(err => {
          console.error('Settings fetch error:', err);
          setLoading(false);
        });
      };
      React.useEffect(() => {
        fetchSettings();
      }, []);
      const handleEdit = setting => {
        setEditingId(setting.id);
        setEditValues({
          ...editValues,
          [setting.id]: setting.value
        });
        setMessage(null);
      };
      const handleCancel = () => {
        setEditingId(null);
        setMessage(null);
      };
      const handleValueChange = (id, value) => {
        setEditValues({
          ...editValues,
          [id]: value
        });
      };
      const handleSave = async setting => {
        setSaving(setting.id);
        setMessage(null);
        try {
          const response = await api.getPage({
            pageName: 'Settings',
            data: {
              action: 'update',
              id: setting.id,
              value: editValues[setting.id]
            }
          });
          if (response.data.success) {
            setMessage({
              type: 'success',
              text: `"${setting.key}" updated successfully!`
            });
            setEditingId(null);
            fetchSettings();
          } else {
            setMessage({
              type: 'error',
              text: response.data.error || 'Failed to update setting.'
            });
          }
        } catch (err) {
          setMessage({
            type: 'error',
            text: 'Failed to update setting.'
          });
        }
        setSaving(null);
      };
      if (loading) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          flex: true,
          justifyContent: "center",
          alignItems: "center",
          style: {
            minHeight: 400
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          fontSize: "lg",
          color: "grey60"
        }, "Loading settings..."));
      }
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "xxl",
        style: {
          background: '#F8FAFC',
          minHeight: '100vh'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mb: "xxl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
        style: {
          color: '#1E293B',
          marginBottom: 4
        }
      }, "Settings"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        color: "grey60",
        fontSize: "md"
      }, "View and manage application configuration")), message && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mb: "xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.MessageBox, {
        variant: message.type === 'success' ? 'success' : 'danger',
        message: message.text,
        onCloseClick: () => setMessage(null)
      })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        bg: "white",
        p: "xl",
        style: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        style: {
          overflowX: 'auto'
        }
      }, /*#__PURE__*/React__default.default.createElement("table", {
        style: {
          width: '100%',
          borderCollapse: 'collapse'
        }
      }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", {
        style: {
          borderBottom: '2px solid #E2E8F0'
        }
      }, /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle
      }, "Key"), /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle
      }, "Value"), /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle
      }, "Description"), /*#__PURE__*/React__default.default.createElement("th", {
        style: thStyle
      }, "Last Updated"), /*#__PURE__*/React__default.default.createElement("th", {
        style: {
          ...thStyle,
          textAlign: 'center'
        }
      }, "Actions"))), /*#__PURE__*/React__default.default.createElement("tbody", null, settings.length === 0 ? /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
        colSpan: 5,
        style: {
          ...tdStyle,
          textAlign: 'center',
          color: '#94A3B8'
        }
      }, "No settings found")) : settings.map(setting => /*#__PURE__*/React__default.default.createElement("tr", {
        key: setting.id,
        style: {
          borderBottom: '1px solid #F1F5F9'
        }
      }, /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        px: "sm",
        py: "xs",
        style: {
          background: '#EEF2FF',
          borderRadius: 6,
          display: 'inline-block',
          fontFamily: 'monospace',
          fontSize: 13,
          fontWeight: 600,
          color: '#4338CA'
        }
      }, setting.key)), /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle
      }, editingId === setting.id ? /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
        value: editValues[setting.id] || '',
        onChange: e => handleValueChange(setting.id, e.target.value),
        style: {
          minWidth: 200
        }
      }) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        style: {
          fontWeight: 500,
          color: '#1E293B'
        }
      }, setting.value)), /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        color: "grey60",
        fontSize: "sm"
      }, setting.description || '—')), /*#__PURE__*/React__default.default.createElement("td", {
        style: tdStyle
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        color: "grey60",
        fontSize: "sm"
      }, setting.updatedAt ? new Date(setting.updatedAt).toLocaleString() : '—')), /*#__PURE__*/React__default.default.createElement("td", {
        style: {
          ...tdStyle,
          textAlign: 'center'
        }
      }, editingId === setting.id ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        flex: true,
        justifyContent: "center"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
        variant: "primary",
        size: "sm",
        onClick: () => handleSave(setting),
        disabled: saving === setting.id,
        mr: "sm"
      }, saving === setting.id ? 'Saving...' : 'Save'), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
        variant: "light",
        size: "sm",
        onClick: handleCancel
      }, "Cancel")) : /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
        variant: "light",
        size: "sm",
        onClick: () => handleEdit(setting)
      }, "Edit")))))))));
    };
    const thStyle = {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: 13,
      fontWeight: 600,
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };
    const tdStyle = {
      padding: '12px 16px',
      fontSize: 14,
      color: '#334155',
      verticalAlign: 'middle'
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.Dashboard = Dashboard;
    AdminJS.UserComponents.Settings = Settings;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQuY29tcG9uZW50LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NldHRpbmdzLmNvbXBvbmVudC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnYWRtaW5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBCb3gsXHJcbiAgICBIMixcclxuICAgIEg0LFxyXG4gICAgSDUsXHJcbiAgICBUZXh0LFxyXG4gICAgSWxsdXN0cmF0aW9uLFxyXG4gICAgTWVzc2FnZUJveCxcclxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuXHJcbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKTtcclxuXHJcbmNvbnN0IHN0YXR1c0NvbG9ycyA9IHtcclxuICAgIHBlbmRpbmc6ICcjRjZBRDU1JyxcclxuICAgIHByb2Nlc3Npbmc6ICcjNjNCM0VEJyxcclxuICAgIHNoaXBwZWQ6ICcjOUY3QUVBJyxcclxuICAgIGRlbGl2ZXJlZDogJyM2OEQzOTEnLFxyXG4gICAgY2FuY2VsbGVkOiAnI0ZDODE4MScsXHJcbn07XHJcblxyXG5jb25zdCBDYXJkID0gKHsgdGl0bGUsIHZhbHVlLCBjb2xvciwgaWNvbiB9KSA9PiAoXHJcbiAgICA8Qm94XHJcbiAgICAgICAgZmxleFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIlxyXG4gICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcclxuICAgICAgICBiZz1cIndoaXRlXCJcclxuICAgICAgICBwPVwieGxcIlxyXG4gICAgICAgIG1yPVwibGdcIlxyXG4gICAgICAgIG1iPVwibGdcIlxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTIsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiAyMDAsXHJcbiAgICAgICAgICAgIGZsZXg6ICcxIDEgMjAwcHgnLFxyXG4gICAgICAgICAgICBib3hTaGFkb3c6ICcwIDJweCA4cHggcmdiYSgwLDAsMCwwLjA4KScsXHJcbiAgICAgICAgICAgIGJvcmRlckxlZnQ6IGA0cHggc29saWQgJHtjb2xvciB8fCAnIzNCODJGNid9YCxcclxuICAgICAgICB9fVxyXG4gICAgPlxyXG4gICAgICAgIDxUZXh0IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG1iPVwic21cIiBzdHlsZT17eyB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogMSB9fT5cclxuICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgIDwvVGV4dD5cclxuICAgICAgICA8SDIgc3R5bGU9e3sgY29sb3I6IGNvbG9yIHx8ICcjMUUyOTNCJywgbWFyZ2luOiAwIH19Pnt2YWx1ZX08L0gyPlxyXG4gICAgPC9Cb3g+XHJcbik7XHJcblxyXG5jb25zdCBTdGF0dXNCYWRnZSA9ICh7IHN0YXR1cyB9KSA9PiAoXHJcbiAgICA8Qm94XHJcbiAgICAgICAgcHg9XCJtZFwiXHJcbiAgICAgICAgcHk9XCJ4c1wiXHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyMCxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzdGF0dXNDb2xvcnNbc3RhdHVzXSB8fCAnI0EwQUVDMCcsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMixcclxuICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcclxuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ2NhcGl0YWxpemUnLFxyXG4gICAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgICAge3N0YXR1c31cclxuICAgIDwvQm94PlxyXG4pO1xyXG5cclxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xyXG4gICAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGFwaS5nZXREYXNoYm9hcmQoKVxyXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHNldERhdGEocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Rhc2hib2FyZCBlcnJvcjonLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIGlmIChsb2FkaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPEJveCBmbGV4IGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIHN0eWxlPXt7IG1pbkhlaWdodDogNDAwIH19PlxyXG4gICAgICAgICAgICAgICAgPFRleHQgZm9udFNpemU9XCJsZ1wiIGNvbG9yPVwiZ3JleTYwXCI+TG9hZGluZyBkYXNoYm9hcmQuLi48L1RleHQ+XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPEJveCBwPVwieHhsXCI+XHJcbiAgICAgICAgICAgICAgICA8TWVzc2FnZUJveCB2YXJpYW50PVwiZGFuZ2VyXCIgbWVzc2FnZT1cIkZhaWxlZCB0byBsb2FkIGRhc2hib2FyZCBkYXRhLlwiIC8+XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQURNSU4gREFTSEJPQVJEXHJcbiAgICBpZiAoZGF0YS5yb2xlID09PSAnYWRtaW4nKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPEJveCBwPVwieHhsXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogJyNGOEZBRkMnLCBtaW5IZWlnaHQ6ICcxMDB2aCcgfX0+XHJcbiAgICAgICAgICAgICAgICB7LyogSGVhZGVyICovfVxyXG4gICAgICAgICAgICAgICAgPEJveCBtYj1cInh4bFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxIMiBzdHlsZT17eyBjb2xvcjogJyMxRTI5M0InLCBtYXJnaW5Cb3R0b206IDQgfX0+e2RhdGEubWVzc2FnZX08L0gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTYwXCIgZm9udFNpemU9XCJtZFwiPkhlcmUgaXMgeW91ciBzdG9yZSBvdmVydmlldzwvVGV4dD5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgIHsvKiBTdGF0cyBDYXJkcyAqL31cclxuICAgICAgICAgICAgICAgIDxCb3ggZmxleCBmbGV4V3JhcD1cIndyYXBcIiBtYj1cInh4bFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDYXJkIHRpdGxlPVwiVG90YWwgVXNlcnNcIiB2YWx1ZT17ZGF0YS5zdGF0cy50b3RhbFVzZXJzfSBjb2xvcj1cIiMzQjgyRjZcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDYXJkIHRpdGxlPVwiVG90YWwgUHJvZHVjdHNcIiB2YWx1ZT17ZGF0YS5zdGF0cy50b3RhbFByb2R1Y3RzfSBjb2xvcj1cIiM4QjVDRjZcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDYXJkIHRpdGxlPVwiVG90YWwgQ2F0ZWdvcmllc1wiIHZhbHVlPXtkYXRhLnN0YXRzLnRvdGFsQ2F0ZWdvcmllc30gY29sb3I9XCIjMDZCNkQ0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8Q2FyZCB0aXRsZT1cIlRvdGFsIE9yZGVyc1wiIHZhbHVlPXtkYXRhLnN0YXRzLnRvdGFsT3JkZXJzfSBjb2xvcj1cIiNGNTlFMEJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDYXJkIHRpdGxlPVwiVG90YWwgUmV2ZW51ZVwiIHZhbHVlPXtgJCR7ZGF0YS5zdGF0cy50b3RhbFJldmVudWV9YH0gY29sb3I9XCIjMTBCOTgxXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgIHsvKiBPcmRlcnMgYnkgU3RhdHVzICovfVxyXG4gICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICAgIGJnPVwid2hpdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHA9XCJ4bFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWI9XCJ4eGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogMTIsIGJveFNoYWRvdzogJzAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMDgpJyB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxINCBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2LCBjb2xvcjogJyMxRTI5M0InIH19Pk9yZGVycyBieSBTdGF0dXM8L0g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxCb3ggZmxleCBmbGV4V3JhcD1cIndyYXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2RhdGEub3JkZXJzQnlTdGF0dXMgJiYgZGF0YS5vcmRlcnNCeVN0YXR1cy5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW0uc3RhdHVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1yPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1iPVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGOEZBRkMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMTIwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0YXR1c0JhZGdlIHN0YXR1cz17aXRlbS5zdGF0dXN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEg0IHN0eWxlPXt7IG1hcmdpbjogJzhweCAwIDAnLCBjb2xvcjogJyMxRTI5M0InIH19PntpdGVtLmNvdW50fTwvSDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgICB7LyogUmVjZW50IE9yZGVycyBUYWJsZSAqL31cclxuICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICBiZz1cIndoaXRlXCJcclxuICAgICAgICAgICAgICAgICAgICBwPVwieGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogMTIsIGJveFNoYWRvdzogJzAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMDgpJyB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxINCBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2LCBjb2xvcjogJyMxRTI5M0InIH19PlJlY2VudCBPcmRlcnM8L0g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxCb3ggc3R5bGU9e3sgb3ZlcmZsb3dYOiAnYXV0bycgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBib3JkZXJDb2xsYXBzZTogJ2NvbGxhcHNlJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgc3R5bGU9e3sgYm9yZGVyQm90dG9tOiAnMnB4IHNvbGlkICNFMkU4RjAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3RoU3R5bGV9Pk9yZGVyIElEPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt0aFN0eWxlfT5DdXN0b21lcjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17dGhTdHlsZX0+QW1vdW50PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt0aFN0eWxlfT5TdGF0dXM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3RoU3R5bGV9PkRhdGU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkYXRhLnJlY2VudE9yZGVycyAmJiBkYXRhLnJlY2VudE9yZGVycy5tYXAoKG9yZGVyKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e29yZGVyLmlkfSBzdHlsZT17eyBib3JkZXJCb3R0b206ICcxcHggc29saWQgI0YxRjVGOScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3RkU3R5bGV9PiN7b3JkZXIuaWR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17dGRTdHlsZX0+e29yZGVyLnVzZXJOYW1lfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3RkU3R5bGV9PiR7b3JkZXIudG90YWxBbW91bnR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17dGRTdHlsZX0+PFN0YXR1c0JhZGdlIHN0YXR1cz17b3JkZXIuc3RhdHVzfSAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3RkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShvcmRlci5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSRUdVTEFSIFVTRVIgREFTSEJPQVJEXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxCb3ggcD1cInh4bFwiIHN0eWxlPXt7IGJhY2tncm91bmQ6ICcjRjhGQUZDJywgbWluSGVpZ2h0OiAnMTAwdmgnIH19PlxyXG4gICAgICAgICAgICB7LyogSGVhZGVyICovfVxyXG4gICAgICAgICAgICA8Qm94IG1iPVwieHhsXCI+XHJcbiAgICAgICAgICAgICAgICA8SDIgc3R5bGU9e3sgY29sb3I6ICcjMUUyOTNCJywgbWFyZ2luQm90dG9tOiA0IH19PntkYXRhLm1lc3NhZ2V9PC9IMj5cclxuICAgICAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTYwXCIgZm9udFNpemU9XCJtZFwiPkhlcmUgaXMgeW91ciBhY2NvdW50IHN1bW1hcnk8L1RleHQ+XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgey8qIFBlcnNvbmFsIEluZm8gKi99XHJcbiAgICAgICAgICAgIHtkYXRhLnBlcnNvbmFsSW5mbyAmJiAoXHJcbiAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgYmc9XCJ3aGl0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcD1cInhsXCJcclxuICAgICAgICAgICAgICAgICAgICBtYj1cInh4bFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAxMiwgYm94U2hhZG93OiAnMCAycHggOHB4IHJnYmEoMCwwLDAsMC4wOCknIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPEg0IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTYsIGNvbG9yOiAnIzFFMjkzQicgfX0+UGVyc29uYWwgSW5mb3JtYXRpb248L0g0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxCb3ggZmxleCBmbGV4V3JhcD1cIndyYXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBtcj1cInh4bFwiIG1iPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIHN0eWxlPXt7IHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBsZXR0ZXJTcGFjaW5nOiAxLCBtYXJnaW5Cb3R0b206IDQgfX0+TmFtZTwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgZm9udFNpemU6IDE2LCBjb2xvcjogJyMxRTI5M0InIH19PntkYXRhLnBlcnNvbmFsSW5mby5uYW1lfTwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggbXI9XCJ4eGxcIiBtYj1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBzdHlsZT17eyB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogMSwgbWFyZ2luQm90dG9tOiA0IH19PkVtYWlsPC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBmb250U2l6ZTogMTYsIGNvbG9yOiAnIzFFMjkzQicgfX0+e2RhdGEucGVyc29uYWxJbmZvLmVtYWlsfTwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggbXI9XCJ4eGxcIiBtYj1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBzdHlsZT17eyB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogMSwgbWFyZ2luQm90dG9tOiA0IH19PlJvbGU8L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHg9XCJtZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHk9XCJ4c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0VFRjJGRicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzQzMzhDQScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ2NhcGl0YWxpemUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2RhdGEucGVyc29uYWxJbmZvLnJvbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgIHsvKiBTdGF0cyBDYXJkcyAqL31cclxuICAgICAgICAgICAgPEJveCBmbGV4IGZsZXhXcmFwPVwid3JhcFwiIG1iPVwieHhsXCI+XHJcbiAgICAgICAgICAgICAgICA8Q2FyZCB0aXRsZT1cIllvdXIgT3JkZXJzXCIgdmFsdWU9e2RhdGEuc3RhdHMudG90YWxPcmRlcnN9IGNvbG9yPVwiIzNCODJGNlwiIC8+XHJcbiAgICAgICAgICAgICAgICA8Q2FyZCB0aXRsZT1cIlRvdGFsIFNwZW50XCIgdmFsdWU9e2AkJHtkYXRhLnN0YXRzLnRvdGFsU3BlbnR9YH0gY29sb3I9XCIjMTBCOTgxXCIgLz5cclxuICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICB7LyogUmVjZW50IE9yZGVycyAqL31cclxuICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgYmc9XCJ3aGl0ZVwiXHJcbiAgICAgICAgICAgICAgICBwPVwieGxcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAxMiwgYm94U2hhZG93OiAnMCAycHggOHB4IHJnYmEoMCwwLDAsMC4wOCknIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxINCBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2LCBjb2xvcjogJyMxRTI5M0InIH19PllvdXIgUmVjZW50IE9yZGVyczwvSDQ+XHJcbiAgICAgICAgICAgICAgICA8Qm94IHN0eWxlPXt7IG92ZXJmbG93WDogJ2F1dG8nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBib3JkZXJDb2xsYXBzZTogJ2NvbGxhcHNlJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHN0eWxlPXt7IGJvcmRlckJvdHRvbTogJzJweCBzb2xpZCAjRTJFOEYwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3RoU3R5bGV9Pk9yZGVyIElEPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3RoU3R5bGV9PkFtb3VudDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt0aFN0eWxlfT5TdGF0dXM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17dGhTdHlsZX0+RGF0ZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGF0YS5yZWNlbnRPcmRlcnMgJiYgZGF0YS5yZWNlbnRPcmRlcnMubWFwKChvcmRlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e29yZGVyLmlkfSBzdHlsZT17eyBib3JkZXJCb3R0b206ICcxcHggc29saWQgI0YxRjVGOScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17dGRTdHlsZX0+I3tvcmRlci5pZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3RkU3R5bGV9PiR7b3JkZXIudG90YWxBbW91bnR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt0ZFN0eWxlfT48U3RhdHVzQmFkZ2Ugc3RhdHVzPXtvcmRlci5zdGF0dXN9IC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt0ZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShvcmRlci5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgIDwvQm94PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IHRoU3R5bGUgPSB7XHJcbiAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcclxuICAgIHBhZGRpbmc6ICcxMnB4IDE2cHgnLFxyXG4gICAgZm9udFNpemU6IDEzLFxyXG4gICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgY29sb3I6ICcjNjQ3NDhCJyxcclxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxyXG4gICAgbGV0dGVyU3BhY2luZzogJzAuNXB4JyxcclxufTtcclxuXHJcbmNvbnN0IHRkU3R5bGUgPSB7XHJcbiAgICBwYWRkaW5nOiAnMTJweCAxNnB4JyxcclxuICAgIGZvbnRTaXplOiAxNCxcclxuICAgIGNvbG9yOiAnIzMzNDE1NScsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBBcGlDbGllbnQgfSBmcm9tICdhZG1pbmpzJztcclxuaW1wb3J0IHtcclxuICAgIEJveCxcclxuICAgIEgyLFxyXG4gICAgSDQsXHJcbiAgICBUZXh0LFxyXG4gICAgTGFiZWwsXHJcbiAgICBJbnB1dCxcclxuICAgIEJ1dHRvbixcclxuICAgIE1lc3NhZ2VCb3gsXHJcbiAgICBUYWJsZSxcclxuICAgIFRhYmxlSGVhZCxcclxuICAgIFRhYmxlQm9keSxcclxuICAgIFRhYmxlUm93LFxyXG4gICAgVGFibGVDZWxsLFxyXG59IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xyXG5cclxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpO1xyXG5cclxuY29uc3QgU2V0dGluZ3MgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBbc2V0dGluZ3MsIHNldFNldHRpbmdzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gICAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gICAgY29uc3QgW2VkaXRWYWx1ZXMsIHNldEVkaXRWYWx1ZXNdID0gdXNlU3RhdGUoe30pO1xyXG4gICAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgICBjb25zdCBbZWRpdGluZ0lkLCBzZXRFZGl0aW5nSWRdID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gICAgY29uc3QgZmV0Y2hTZXR0aW5ncyA9ICgpID0+IHtcclxuICAgICAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgICAgIGFwaS5nZXRQYWdlKHsgcGFnZU5hbWU6ICdTZXR0aW5ncycgfSlcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRTZXR0aW5ncyhyZXNwb25zZS5kYXRhLnNldHRpbmdzIHx8IFtdKTtcclxuICAgICAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2V0dGluZ3MgZmV0Y2ggZXJyb3I6JywgZXJyKTtcclxuICAgICAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBmZXRjaFNldHRpbmdzKCk7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgY29uc3QgaGFuZGxlRWRpdCA9IChzZXR0aW5nKSA9PiB7XHJcbiAgICAgICAgc2V0RWRpdGluZ0lkKHNldHRpbmcuaWQpO1xyXG4gICAgICAgIHNldEVkaXRWYWx1ZXMoeyAuLi5lZGl0VmFsdWVzLCBbc2V0dGluZy5pZF06IHNldHRpbmcudmFsdWUgfSk7XHJcbiAgICAgICAgc2V0TWVzc2FnZShudWxsKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQ2FuY2VsID0gKCkgPT4ge1xyXG4gICAgICAgIHNldEVkaXRpbmdJZChudWxsKTtcclxuICAgICAgICBzZXRNZXNzYWdlKG51bGwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVWYWx1ZUNoYW5nZSA9IChpZCwgdmFsdWUpID0+IHtcclxuICAgICAgICBzZXRFZGl0VmFsdWVzKHsgLi4uZWRpdFZhbHVlcywgW2lkXTogdmFsdWUgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoc2V0dGluZykgPT4ge1xyXG4gICAgICAgIHNldFNhdmluZyhzZXR0aW5nLmlkKTtcclxuICAgICAgICBzZXRNZXNzYWdlKG51bGwpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLmdldFBhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgcGFnZU5hbWU6ICdTZXR0aW5ncycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndXBkYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBpZDogc2V0dGluZy5pZCxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZWRpdFZhbHVlc1tzZXR0aW5nLmlkXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRNZXNzYWdlKHsgdHlwZTogJ3N1Y2Nlc3MnLCB0ZXh0OiBgXCIke3NldHRpbmcua2V5fVwiIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5IWAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZXRFZGl0aW5nSWQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBmZXRjaFNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXRNZXNzYWdlKHsgdHlwZTogJ2Vycm9yJywgdGV4dDogcmVzcG9uc2UuZGF0YS5lcnJvciB8fCAnRmFpbGVkIHRvIHVwZGF0ZSBzZXR0aW5nLicgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIHRleHQ6ICdGYWlsZWQgdG8gdXBkYXRlIHNldHRpbmcuJyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0U2F2aW5nKG51bGwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAobG9hZGluZykge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxCb3ggZmxleCBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBzdHlsZT17eyBtaW5IZWlnaHQ6IDQwMCB9fT5cclxuICAgICAgICAgICAgICAgIDxUZXh0IGZvbnRTaXplPVwibGdcIiBjb2xvcj1cImdyZXk2MFwiPkxvYWRpbmcgc2V0dGluZ3MuLi48L1RleHQ+XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8Qm94IHA9XCJ4eGxcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnI0Y4RkFGQycsIG1pbkhlaWdodDogJzEwMHZoJyB9fT5cclxuICAgICAgICAgICAgey8qIEhlYWRlciAqL31cclxuICAgICAgICAgICAgPEJveCBtYj1cInh4bFwiPlxyXG4gICAgICAgICAgICAgICAgPEgyIHN0eWxlPXt7IGNvbG9yOiAnIzFFMjkzQicsIG1hcmdpbkJvdHRvbTogNCB9fT5TZXR0aW5nczwvSDI+XHJcbiAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk2MFwiIGZvbnRTaXplPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgICBWaWV3IGFuZCBtYW5hZ2UgYXBwbGljYXRpb24gY29uZmlndXJhdGlvblxyXG4gICAgICAgICAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgIHsvKiBNZXNzYWdlICovfVxyXG4gICAgICAgICAgICB7bWVzc2FnZSAmJiAoXHJcbiAgICAgICAgICAgICAgICA8Qm94IG1iPVwieGxcIj5cclxuICAgICAgICAgICAgICAgICAgICA8TWVzc2FnZUJveFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PXttZXNzYWdlLnR5cGUgPT09ICdzdWNjZXNzJyA/ICdzdWNjZXNzJyA6ICdkYW5nZXInfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlLnRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2VDbGljaz17KCkgPT4gc2V0TWVzc2FnZShudWxsKX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICB7LyogU2V0dGluZ3MgVGFibGUgKi99XHJcbiAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgIGJnPVwid2hpdGVcIlxyXG4gICAgICAgICAgICAgICAgcD1cInhsXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogMTIsIGJveFNoYWRvdzogJzAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMDgpJyB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Qm94IHN0eWxlPXt7IG92ZXJmbG93WDogJ2F1dG8nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBib3JkZXJDb2xsYXBzZTogJ2NvbGxhcHNlJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHN0eWxlPXt7IGJvcmRlckJvdHRvbTogJzJweCBzb2xpZCAjRTJFOEYwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3RoU3R5bGV9PktleTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt0aFN0eWxlfT5WYWx1ZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt0aFN0eWxlfT5EZXNjcmlwdGlvbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt0aFN0eWxlfT5MYXN0IFVwZGF0ZWQ8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17eyAuLi50aFN0eWxlLCB0ZXh0QWxpZ246ICdjZW50ZXInIH19PkFjdGlvbnM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NldHRpbmdzLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXs1fSBzdHlsZT17eyAuLi50ZFN0eWxlLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBjb2xvcjogJyM5NEEzQjgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gc2V0dGluZ3MgZm91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5tYXAoKHNldHRpbmcpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17c2V0dGluZy5pZH0gc3R5bGU9e3sgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNGMUY1RjknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt0ZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB4PVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBweT1cInhzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRUVGMkZGJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ21vbm9zcGFjZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM0MzM4Q0EnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NldHRpbmcua2V5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17dGRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2VkaXRpbmdJZCA9PT0gc2V0dGluZy5pZCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZWRpdFZhbHVlc1tzZXR0aW5nLmlkXSB8fCAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlVmFsdWVDaGFuZ2Uoc2V0dGluZy5pZCwgZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWluV2lkdGg6IDIwMCB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6ICcjMUUyOTNCJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZXR0aW5nLnZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3RkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTYwXCIgZm9udFNpemU9XCJzbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2V0dGluZy5kZXNjcmlwdGlvbiB8fCAn4oCUJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt0ZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk2MFwiIGZvbnRTaXplPVwic21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NldHRpbmcudXBkYXRlZEF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG5ldyBEYXRlKHNldHRpbmcudXBkYXRlZEF0KS50b0xvY2FsZVN0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICfigJQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgLi4udGRTdHlsZSwgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZWRpdGluZ0lkID09PSBzZXR0aW5nLmlkID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGZsZXgganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTYXZlKHNldHRpbmcpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzYXZpbmcgPT09IHNldHRpbmcuaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXI9XCJzbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmluZyA9PT0gc2V0dGluZy5pZCA/ICdTYXZpbmcuLi4nIDogJ1NhdmUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImxpZ2h0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNhbmNlbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwibGlnaHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUVkaXQoc2V0dGluZyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICA8L0JveD5cclxuICAgICAgICA8L0JveD5cclxuICAgICk7XHJcbn07XHJcblxyXG5jb25zdCB0aFN0eWxlID0ge1xyXG4gICAgdGV4dEFsaWduOiAnbGVmdCcsXHJcbiAgICBwYWRkaW5nOiAnMTJweCAxNnB4JyxcclxuICAgIGZvbnRTaXplOiAxMyxcclxuICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgIGNvbG9yOiAnIzY0NzQ4QicsXHJcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcclxuICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCcsXHJcbn07XHJcblxyXG5jb25zdCB0ZFN0eWxlID0ge1xyXG4gICAgcGFkZGluZzogJzEycHggMTZweCcsXHJcbiAgICBmb250U2l6ZTogMTQsXHJcbiAgICBjb2xvcjogJyMzMzQxNTUnLFxyXG4gICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5ncztcclxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZC5jb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NldHRpbmdzLmNvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2V0dGluZ3MgPSBTZXR0aW5ncyJdLCJuYW1lcyI6WyJhcGkiLCJBcGlDbGllbnQiLCJzdGF0dXNDb2xvcnMiLCJwZW5kaW5nIiwicHJvY2Vzc2luZyIsInNoaXBwZWQiLCJkZWxpdmVyZWQiLCJjYW5jZWxsZWQiLCJDYXJkIiwidGl0bGUiLCJ2YWx1ZSIsImNvbG9yIiwiaWNvbiIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkJveCIsImZsZXgiLCJmbGV4RGlyZWN0aW9uIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiYmciLCJwIiwibXIiLCJtYiIsInN0eWxlIiwiYm9yZGVyUmFkaXVzIiwibWluV2lkdGgiLCJib3hTaGFkb3ciLCJib3JkZXJMZWZ0IiwiVGV4dCIsImZvbnRTaXplIiwidGV4dFRyYW5zZm9ybSIsImxldHRlclNwYWNpbmciLCJIMiIsIm1hcmdpbiIsIlN0YXR1c0JhZGdlIiwic3RhdHVzIiwicHgiLCJweSIsImJhY2tncm91bmRDb2xvciIsImZvbnRXZWlnaHQiLCJkaXNwbGF5IiwiRGFzaGJvYXJkIiwiZGF0YSIsInNldERhdGEiLCJ1c2VTdGF0ZSIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwidXNlRWZmZWN0IiwiZ2V0RGFzaGJvYXJkIiwidGhlbiIsInJlc3BvbnNlIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJtaW5IZWlnaHQiLCJNZXNzYWdlQm94IiwidmFyaWFudCIsIm1lc3NhZ2UiLCJyb2xlIiwiYmFja2dyb3VuZCIsIm1hcmdpbkJvdHRvbSIsImZsZXhXcmFwIiwic3RhdHMiLCJ0b3RhbFVzZXJzIiwidG90YWxQcm9kdWN0cyIsInRvdGFsQ2F0ZWdvcmllcyIsInRvdGFsT3JkZXJzIiwidG90YWxSZXZlbnVlIiwiSDQiLCJvcmRlcnNCeVN0YXR1cyIsIm1hcCIsIml0ZW0iLCJrZXkiLCJjb3VudCIsIm92ZXJmbG93WCIsIndpZHRoIiwiYm9yZGVyQ29sbGFwc2UiLCJib3JkZXJCb3R0b20iLCJ0aFN0eWxlIiwicmVjZW50T3JkZXJzIiwib3JkZXIiLCJpZCIsInRkU3R5bGUiLCJ1c2VyTmFtZSIsInRvdGFsQW1vdW50IiwiRGF0ZSIsImNyZWF0ZWRBdCIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInBlcnNvbmFsSW5mbyIsIm5hbWUiLCJlbWFpbCIsInRvdGFsU3BlbnQiLCJ0ZXh0QWxpZ24iLCJwYWRkaW5nIiwiU2V0dGluZ3MiLCJzZXR0aW5ncyIsInNldFNldHRpbmdzIiwic2F2aW5nIiwic2V0U2F2aW5nIiwiZWRpdFZhbHVlcyIsInNldEVkaXRWYWx1ZXMiLCJzZXRNZXNzYWdlIiwiZWRpdGluZ0lkIiwic2V0RWRpdGluZ0lkIiwiZmV0Y2hTZXR0aW5ncyIsImdldFBhZ2UiLCJwYWdlTmFtZSIsImhhbmRsZUVkaXQiLCJzZXR0aW5nIiwiaGFuZGxlQ2FuY2VsIiwiaGFuZGxlVmFsdWVDaGFuZ2UiLCJoYW5kbGVTYXZlIiwiYWN0aW9uIiwic3VjY2VzcyIsInR5cGUiLCJ0ZXh0Iiwib25DbG9zZUNsaWNrIiwibGVuZ3RoIiwiY29sU3BhbiIsImZvbnRGYW1pbHkiLCJJbnB1dCIsIm9uQ2hhbmdlIiwiZSIsInRhcmdldCIsImRlc2NyaXB0aW9uIiwidXBkYXRlZEF0IiwidG9Mb2NhbGVTdHJpbmciLCJCdXR0b24iLCJzaXplIiwib25DbGljayIsImRpc2FibGVkIiwidmVydGljYWxBbGlnbiIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQVlBLE1BQU1BLEtBQUcsR0FBRyxJQUFJQyxpQkFBUyxFQUFFO0lBRTNCLE1BQU1DLFlBQVksR0FBRztJQUNqQkMsRUFBQUEsT0FBTyxFQUFFLFNBQVM7SUFDbEJDLEVBQUFBLFVBQVUsRUFBRSxTQUFTO0lBQ3JCQyxFQUFBQSxPQUFPLEVBQUUsU0FBUztJQUNsQkMsRUFBQUEsU0FBUyxFQUFFLFNBQVM7SUFDcEJDLEVBQUFBLFNBQVMsRUFBRTtJQUNmLENBQUM7SUFFRCxNQUFNQyxJQUFJLEdBQUdBLENBQUM7TUFBRUMsS0FBSztNQUFFQyxLQUFLO01BQUVDLEtBQUs7SUFBRUMsRUFBQUE7SUFBSyxDQUFDLGtCQUN2Q0Msc0JBQUEsQ0FBQUMsYUFBQSxDQUFDQyxnQkFBRyxFQUFBO01BQ0FDLElBQUksRUFBQSxJQUFBO0lBQ0pDLEVBQUFBLGFBQWEsRUFBQyxRQUFRO0lBQ3RCQyxFQUFBQSxVQUFVLEVBQUMsUUFBUTtJQUNuQkMsRUFBQUEsY0FBYyxFQUFDLFFBQVE7SUFDdkJDLEVBQUFBLEVBQUUsRUFBQyxPQUFPO0lBQ1ZDLEVBQUFBLENBQUMsRUFBQyxJQUFJO0lBQ05DLEVBQUFBLEVBQUUsRUFBQyxJQUFJO0lBQ1BDLEVBQUFBLEVBQUUsRUFBQyxJQUFJO0lBQ1BDLEVBQUFBLEtBQUssRUFBRTtJQUNIQyxJQUFBQSxZQUFZLEVBQUUsRUFBRTtJQUNoQkMsSUFBQUEsUUFBUSxFQUFFLEdBQUc7SUFDYlYsSUFB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
