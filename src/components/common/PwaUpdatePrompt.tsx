import { useEffect } from 'react';
import { notification, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      notification.info({
        message: 'Nova versão disponível!',
        description: 'Uma nova versão do SmartTreino está disponível. Clique para atualizar.',
        duration: 0, // Don't auto-close
        placement: 'bottomRight',
        btn: (
          <Button
            type="primary"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => {
              updateServiceWorker(true);
              setNeedRefresh(false);
            }}
          >
            Atualizar Agora
          </Button>
        ),
        onClose: () => setNeedRefresh(false),
      });
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  return null;
}
