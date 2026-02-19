# PWA Testing Checklist

Complete guia de testes para validar a implementação PWA do SmartTreino.

## Desktop Testing (Chrome DevTools)

### Service Worker
- [ ] Abrir DevTools > Application > Service Workers
- [ ] Verificar status "activated" e "running"
- [ ] Verificar que o SW está registrado no scope correto (`/`)
- [ ] Testar "Update on reload" para desenvolvimento
- [ ] Verificar que não há erros no console

### Manifest
- [ ] DevTools > Application > Manifest
- [ ] Verificar todos os campos:
  - [ ] `name`: "SmartTreino"
  - [ ] `short_name`: "SmartTreino"
  - [ ] `description`: Texto correto
  - [ ] `theme_color`: "#1677ff"
  - [ ] `background_color`: "#ffffff"
  - [ ] `display`: "standalone"
  - [ ] `start_url`: "/"
- [ ] Verificar ícones aparecem sem erros (192x192, 512x512)
- [ ] Clicar em "Add to home screen" (se disponível)

### Cache Storage
- [ ] DevTools > Application > Storage > Cache Storage
- [ ] Verificar cache `workbox-precache-v2-...` criado
- [ ] Verificar assets cacheados (JS, CSS, HTML, fonts)
- [ ] Limpar cache e recarregar - verificar que recria

### Offline Mode
- [ ] DevTools > Network > Throttling > Offline
- [ ] Recarregar página - deve funcionar com assets cacheados
- [ ] Verificar que API calls falham (esperado - sem offline queue)
- [ ] Voltar online - tudo deve funcionar normalmente

### Update Flow
- [ ] Fazer uma mudança no código (ex: mudar texto)
- [ ] `npm run build`
- [ ] Recarregar app
- [ ] Verificar notificação de atualização aparece
- [ ] Clicar em "Atualizar Agora"
- [ ] Verificar que nova versão carrega

## Mobile Testing (Android - Chrome)

### Pré-requisitos
1. Build de produção:
   ```bash
   npm run build
   npm run preview:https
   ```

2. Descobrir IP local:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```

3. Acessar no Chrome Android: `https://<seu-ip>:4173`
4. Aceitar certificado self-signed (desenvolvimento)

### Instalação
- [ ] Menu Chrome > "Adicionar à tela inicial" aparece
- [ ] Clicar em "Adicionar"
- [ ] Verificar ícone na home screen
- [ ] Abrir app - deve abrir sem barra de navegação (standalone)
- [ ] Verificar splash screen aparece (ícone 512x512)

### Install Prompt Component
- [ ] Verificar card de instalação aparece no canto inferior direito
- [ ] Clicar em "Instalar"
- [ ] Verificar prompt nativo do Chrome aparece
- [ ] Instalar e verificar funciona
- [ ] Verificar prompt desaparece após instalação

### Wake Lock
- [ ] Abrir uma sessão de treino ativa
- [ ] Verificar tag "Tela mantida ativa" aparece no header
- [ ] Deixar celular parado por 1-2 minutos
- [ ] Verificar que tela NÃO bloqueia automaticamente
- [ ] Finalizar treino
- [ ] Verificar que tela volta a bloquear normalmente

### Offline (Partial)
- [ ] Com app instalado, ativar modo avião
- [ ] Abrir app - deve carregar interface (assets cacheados)
- [ ] Tentar fazer login/carregar dados - deve falhar (esperado)
- [ ] Desativar modo avião - tudo deve voltar ao normal

### Performance
- [ ] App abre rapidamente (<2s)
- [ ] Navegação entre páginas é fluida
- [ ] Sem travamentos ou lags

## Mobile Testing (iOS - Safari)

### Instalação
- [ ] Abrir no Safari: `https://<seu-ip>:4173`
- [ ] Clicar no botão "Compartilhar" (ícone de seta)
- [ ] Rolar até "Adicionar à Tela de Início"
- [ ] Editar nome se necessário
- [ ] Clicar em "Adicionar"
- [ ] Verificar ícone na home screen
- [ ] Abrir app - deve abrir sem barra do Safari

### Limitações iOS
- ⚠️ **Wake Lock não suportado** - tela vai bloquear normalmente
- ⚠️ **Install prompt não aparece** - apenas via Safari Share
- ✅ Service Worker funciona (parcialmente)
- ✅ Manifest funciona
- ✅ Cache de assets funciona

### Offline (iOS)
- [ ] Com app instalado, ativar modo avião
- [ ] Abrir app - deve carregar interface
- [ ] Verificar funcionalidade limitada (esperado)

## Lighthouse Audit

### Desktop
1. DevTools > Lighthouse
2. Categories: Performance, PWA, Best Practices
3. Device: Desktop
4. Clicar em "Analyze page load"

**Score Esperado**:
- [ ] PWA: **90+** ✅
- [ ] Performance: **80+**
- [ ] Best Practices: **90+**

### Mobile
1. Lighthouse > Device: Mobile
2. Run audit

**Score Esperado**:
- [ ] PWA: **90+** ✅
- [ ] Performance: **70+** (mobile é mais exigente)

### PWA Checklist (Lighthouse)
- [ ] ✅ Registers a service worker
- [ ] ✅ Responds with 200 when offline
- [ ] ✅ Contains a web app manifest
- [ ] ✅ Configured for a custom splash screen
- [ ] ✅ Sets a theme color
- [ ] ✅ Content is sized correctly for viewport
- [ ] ✅ Has a `<meta name="viewport">` tag
- [ ] ✅ Provides a valid `apple-touch-icon`

## Real-World Testing

### Daily Use Scenario (Android)
- [ ] Instalar app no celular pessoal
- [ ] Usar por 1 semana normalmente
- [ ] Registrar qualquer bug ou problema UX
- [ ] Verificar notificações de atualização funcionam
- [ ] Verificar Wake Lock durante treinos reais

### Edge Cases
- [ ] Testar com battery saver ativo (Wake Lock pode falhar)
- [ ] Testar com conexão lenta (3G)
- [ ] Testar com app em background e voltar
- [ ] Testar reinstalação
- [ ] Testar desinstalação

## Common Issues & Solutions

### Service Worker não registra
**Sintoma**: Console mostra erro de registro
**Solução**:
- Verificar HTTPS está ativo
- Limpar cache do browser
- Verificar `vite-plugin-pwa` instalado corretamente
- Rodar `npm run build` novamente

### Ícones não aparecem
**Sintoma**: Ícones quebrados no manifest
**Solução**:
- Verificar arquivos existem em `public/icons/`
- Verificar nomes dos arquivos batem com manifest
- Verificar formato PNG (não SVG)
- Regenerar ícones com tamanhos exatos (192, 512)

### Install prompt não aparece
**Sintoma**: Nenhum prompt de instalação
**Solução**:
- Já está instalado (verificar `chrome://apps`)
- iOS requer Safari Share menu (não há prompt automático)
- Desktop requer "engagement" do usuário (visitar várias vezes)
- Verificar `beforeinstallprompt` event listener funciona

### Wake Lock não funciona
**Sintoma**: Tela bloqueia durante treino
**Solução**:
- Verificar HTTPS ativo
- iOS não suporta (esperado)
- Battery saver pode bloquear (esperado)
- Verificar console para erros
- Testar em Chrome Android

### Update não aparece
**Sintoma**: Nova versão não mostra notificação
**Solução**:
- Fazer hard refresh (Ctrl+Shift+R)
- Verificar `skipWaiting: true` no workbox config
- Aguardar ~30s após build (SW precisa detectar mudança)
- Verificar console para erros do SW

## Performance Benchmarks

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Size
- [ ] Main bundle < 500KB
- [ ] Vendor bundle < 1MB
- [ ] Total transfer < 2MB (first load)

## Sign-off Checklist

Antes de considerar PWA completo, verificar:

- [ ] ✅ Service Worker registrado e funcionando
- [ ] ✅ Manifest válido com todos os campos
- [ ] ✅ Ícones gerados (192x192, 512x512)
- [ ] ✅ Instalável em Android via Chrome
- [ ] ✅ Instalável em iOS via Safari
- [ ] ✅ Update prompt funciona
- [ ] ✅ Install prompt aparece (Android)
- [ ] ✅ Wake Lock ativo durante treinos (Android)
- [ ] ✅ Lighthouse PWA score > 90
- [ ] ✅ Assets cacheados para uso parcial offline
- [ ] ✅ Testado em dispositivo Android real
- [ ] ✅ Testado em dispositivo iOS real (se disponível)
- [ ] ✅ Documentação atualizada

## Next Steps

Após passar em todos os testes:

1. **Deploy to Production**
   - Verificar HTTPS configurado
   - Verificar domínio real funciona
   - Re-testar instalação em produção

2. **Monitor Usage**
   - Analytics: quantos usuários instalam?
   - Analytics: install prompt conversion rate
   - Crash reports relacionados a SW

3. **Future Improvements**
   - Offline queue para API calls
   - Background sync
   - Push notifications
   - Periodic background sync

---

**Status**: ⏳ Aguardando testes

**Última atualização**: 2026-02-19
