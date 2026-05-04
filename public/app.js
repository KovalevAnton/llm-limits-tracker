// LLM Limits Tracker — frontend logic.
// State lives in localStorage; the proxy server (server.js) only relays
// outbound probe calls so we can read upstream rate-limit headers.
//
// All HTML interpolation routes user-controlled values through escapeHtml();
// only project-owned i18n strings flow in raw, so they can carry inline
// <strong>/<code> markup in the copy.

// ===== i18n =====
const T = {
  ru: {
    'nav.dashboard': 'Дашборд', 'nav.providers': 'Провайдеры', 'nav.alerts': 'Алерты', 'nav.about': 'О приложении',
    'providers.title': 'Провайдеры',
    'providers.subtitle': 'Восемь LLM API в одном дашборде. Ключи хранятся локально в браузере; сервер их не сохраняет.',
    'alerts.title': 'Алерты',
    'alerts.subtitle': 'Когда и куда сообщать что лимиты подходят к концу.',
    'dashboard.title': 'Лимиты по провайдерам',
    'dashboard.subtitle': 'Один взгляд вместо восьми консолей. Ключи живут только в браузере; прокси нужен лишь для самого запроса.',
    'toolbar.refresh': 'Обновить все', 'toolbar.refreshing': 'Обновляем…',
    'toolbar.autoOn': 'Авто · вкл', 'toolbar.autoOff': 'Авто · выкл',
    'toolbar.lastChecked': 'Обновлено {time}', 'toolbar.never': 'Ещё не обновлялось',
    'health.healthy': 'в норме', 'health.warn': 'на подходе', 'health.bad': 'у предела', 'health.idle': 'не настроено',
    'card.notConfigured': 'Не настроено', 'card.waiting': 'Ожидание',
    'card.empty': 'Добавьте API-ключ в Настройках, чтобы начать отслеживание.',
    'card.refreshFirst': 'Нажмите «Обновить все», чтобы запросить лимиты.',
    'card.statusOk': 'OK', 'card.statusWarn': 'На подходе', 'card.statusBad': 'У предела',
    'card.statusError': 'Ошибка', 'card.statusAuth': 'Auth', 'card.statusHttp': 'HTTP {status}',
    'card.openSettings': 'Открыть настройки',
    'alert.providerError': 'HTTP {status} — проверьте ключ или квоту.',
    'alert.atPct': '{label} — {pct}%',
    'empty.heroTitle': 'Добавьте ключ — увидите лимиты',
    'empty.heroBody': 'Подключите API-ключи восьми провайдеров и следите за rate limits в одном месте. Никакой регистрации, ничего на стороне сервера.',
    'empty.heroCta': 'Открыть настройки',
    'settings.title': 'Настройки',
    'settings.subtitle': 'Ключи хранятся локально в браузере (localStorage). Сервер их не сохраняет.',
    'settings.show': 'Показать', 'settings.hide': 'Скрыть',
    'settings.thresholds': 'Пороги алертов',
    'settings.thresholdsHelp': 'При каком % использования показывать предупреждение и алерт.',
    'notifications.title': 'Уведомления',
    'notifications.help': 'Получайте алерты в Slack или Discord, когда метрика пересекает порог. Webhook URL хранится только в браузере; сервер пересылает запрос, но не сохраняет.',
    'notifications.slackLabel': 'Slack webhook URL',
    'notifications.discordLabel': 'Discord webhook URL',
    'notifications.test': 'Проверить',
    'notifications.testLabel': 'Тест-алерт',
    'notifications.sending': 'Отправляем…',
    'notifications.testSent': 'Тест-алерт отправлен',
    'notifications.testFailed': 'Не удалось отправить — проверьте URL',
    'notifications.noUrl': 'Сначала введите URL',
    'settings.warnLabel': 'Предупреждение, %', 'settings.badLabel': 'Критическая отметка, %',
    'settings.getKey': 'получить ключ', 'settings.configured': 'настроен',
    'about.title': 'О приложении',
    'about.subtitle': 'Локальный дашборд лимитов вместо хождения по консолям.',
    'about.intro': 'Standalone-приложение опрашивает API провайдеров маленьким запросом и читает <strong>rate-limit заголовки</strong> или специальные эндпоинты (<code>/api/v1/auth/key</code> у OpenRouter):',
    'about.bulletAnthropic': '<strong>Anthropic</strong> — <code>anthropic-ratelimit-*</code> (RPM + input/output TPM).',
    'about.bulletOpenAICompat': '<strong>OpenAI / Groq / Fireworks / Mistral / Together</strong> — <code>x-ratelimit-*</code> (RPM + TPM).',
    'about.bulletOpenRouter': '<strong>OpenRouter</strong> — баланс кредитов и rate limit из <code>/api/v1/auth/key</code>.',
    'about.bulletGemini': '<strong>Gemini</strong> — заголовки rate-limit не отдаются; статус по 200/429.',
    'about.subsNote': 'Лимиты <em>подписок</em> (Claude Pro/Max, ChatGPT Plus/Pro, Gemini Advanced) у API недоступны — это закрытые UI-метрики. Здесь видны лимиты вашего <em>API-аккаунта</em>.',
    'gemini.note200': 'API доступен. Точные лимиты не публикуются — следим за 429.',
    'deepseek.balanceLabel': 'Баланс',
    'deepseek.insufficient': 'Недостаточно средств — пополните баланс на platform.deepseek.com',
    'gemini.note429': 'Превышена квота (429).', 'gemini.noteAuth': 'Ключ невалиден или не имеет прав.', 'gemini.noteOther': 'Статус {status}',
    'reset.window': 'окно 1 мин',
  },
  en: {
    'nav.dashboard': 'Dashboard', 'nav.providers': 'Providers', 'nav.alerts': 'Alerts', 'nav.about': 'About',
    'providers.title': 'Providers',
    'providers.subtitle': 'Eight LLM APIs in one dashboard. Keys live locally in your browser; the server never stores them.',
    'alerts.title': 'Alerts',
    'alerts.subtitle': 'When and where to notify you that limits are filling up.',
    'dashboard.title': 'Limits by provider',
    'dashboard.subtitle': "One glance instead of eight consoles. Keys live only in your browser; the proxy only relays the probe.",
    'toolbar.refresh': 'Refresh all', 'toolbar.refreshing': 'Refreshing…',
    'toolbar.autoOn': 'Auto · on', 'toolbar.autoOff': 'Auto · off',
    'toolbar.lastChecked': 'Updated {time}', 'toolbar.never': 'Never updated',
    'health.healthy': 'healthy', 'health.warn': 'approaching', 'health.bad': 'near cap', 'health.idle': 'idle',
    'card.notConfigured': 'Not configured', 'card.waiting': 'Waiting',
    'card.empty': 'Add an API key in Settings to start tracking.',
    'card.refreshFirst': "Click 'Refresh all' to query limits.",
    'card.statusOk': 'OK', 'card.statusWarn': 'Approaching', 'card.statusBad': 'Near cap',
    'card.statusError': 'Error', 'card.statusAuth': 'Auth', 'card.statusHttp': 'HTTP {status}',
    'card.openSettings': 'Open settings',
    'alert.providerError': 'HTTP {status} — check your key or quota.',
    'alert.atPct': '{label} at {pct}%',
    'empty.heroTitle': 'Add a key, see your limits',
    'empty.heroBody': 'Connect API keys for any of the eight supported providers and track all rate limits in one place. No signup, nothing stored server-side.',
    'empty.heroCta': 'Open settings',
    'settings.title': 'Settings',
    'settings.subtitle': 'Keys live locally in your browser (localStorage). The server never stores them.',
    'settings.show': 'Show', 'settings.hide': 'Hide',
    'settings.thresholds': 'Alert thresholds',
    'settings.thresholdsHelp': 'At what % of usage to show warning and critical alerts.',
    'notifications.title': 'Notifications',
    'notifications.help': 'Get alerts on Slack or Discord when a metric crosses a threshold. The webhook URL stays in your browser; the server only relays, never persists.',
    'notifications.slackLabel': 'Slack webhook URL',
    'notifications.discordLabel': 'Discord webhook URL',
    'notifications.test': 'Test',
    'notifications.testLabel': 'Test alert',
    'notifications.sending': 'Sending…',
    'notifications.testSent': 'Test alert sent',
    'notifications.testFailed': 'Failed to send — check the URL',
    'notifications.noUrl': 'Enter a URL first',
    'settings.warnLabel': 'Warning, %', 'settings.badLabel': 'Critical, %',
    'settings.getKey': 'get key', 'settings.configured': 'configured',
    'about.title': 'About',
    'about.subtitle': 'Local dashboard of API limits — no jumping between provider consoles.',
    'about.intro': 'This standalone app probes provider APIs with a tiny request and reads <strong>rate-limit headers</strong> or dedicated endpoints (<code>/api/v1/auth/key</code> on OpenRouter):',
    'about.bulletAnthropic': '<strong>Anthropic</strong> — <code>anthropic-ratelimit-*</code> (RPM + input/output TPM).',
    'about.bulletOpenAICompat': '<strong>OpenAI / Groq / Fireworks / Mistral / Together</strong> — <code>x-ratelimit-*</code> (RPM + TPM).',
    'about.bulletOpenRouter': '<strong>OpenRouter</strong> — credit balance and rate limit from <code>/api/v1/auth/key</code>.',
    'about.bulletGemini': "<strong>Gemini</strong> — no rate-limit headers; status read from 200/429.",
    'about.subsNote': "Subscription limits (Claude Pro/Max, ChatGPT Plus/Pro, Gemini Advanced) aren't exposed via API — they're closed UI metrics. This shows limits of your <em>API account</em>.",
    'gemini.note200': "API reachable. Exact limits aren't published — we watch for 429s.",
    'deepseek.balanceLabel': 'Balance',
    'deepseek.insufficient': 'Insufficient balance — top up at platform.deepseek.com',
    'gemini.note429': 'Quota exceeded (429).', 'gemini.noteAuth': 'Key invalid or unauthorized.', 'gemini.noteOther': 'Status {status}',
    'reset.window': '1 min window',
  },
  es: {
    'nav.dashboard': 'Panel', 'nav.providers': 'Proveedores', 'nav.alerts': 'Alertas', 'nav.about': 'Acerca de',
    'providers.title': 'Proveedores',
    'providers.subtitle': 'Ocho APIs LLM en un solo panel. Las claves se guardan localmente en tu navegador; el servidor no las almacena.',
    'alerts.title': 'Alertas',
    'alerts.subtitle': 'Cuándo y dónde avisarte que los límites se están agotando.',
    'dashboard.title': 'Límites por proveedor',
    'dashboard.subtitle': 'Una vista en lugar de ocho consolas. Las claves viven solo en tu navegador; el proxy solo reenvía la prueba.',
    'toolbar.refresh': 'Actualizar todo', 'toolbar.refreshing': 'Actualizando…',
    'toolbar.autoOn': 'Auto · activado', 'toolbar.autoOff': 'Auto · desactivado',
    'toolbar.lastChecked': 'Actualizado {time}', 'toolbar.never': 'Sin actualizar',
    'health.healthy': 'sano', 'health.warn': 'cercano', 'health.bad': 'al límite', 'health.idle': 'inactivo',
    'card.notConfigured': 'Sin configurar', 'card.waiting': 'Esperando',
    'card.empty': 'Añade una clave API en Ajustes para empezar.',
    'card.refreshFirst': "Pulsa 'Actualizar todo' para consultar límites.",
    'card.statusOk': 'OK', 'card.statusWarn': 'Cercano', 'card.statusBad': 'Al límite',
    'card.statusError': 'Error', 'card.statusAuth': 'Auth', 'card.statusHttp': 'HTTP {status}',
    'card.openSettings': 'Abrir ajustes',
    'alert.providerError': 'HTTP {status} — revisa la clave o la cuota.',
    'alert.atPct': '{label} al {pct}%',
    'empty.heroTitle': 'Añade una clave para ver tus límites',
    'empty.heroBody': 'Conecta claves API de cualquiera de los ocho proveedores soportados y sigue todos los rate limits en un sitio. Sin registro, nada se guarda en el servidor.',
    'empty.heroCta': 'Abrir ajustes',
    'settings.title': 'Ajustes',
    'settings.subtitle': 'Las claves se guardan localmente en tu navegador (localStorage). El servidor no las almacena.',
    'settings.show': 'Mostrar', 'settings.hide': 'Ocultar',
    'settings.thresholds': 'Umbrales de alerta',
    'settings.thresholdsHelp': 'A qué % de uso mostrar aviso y alerta crítica.',
    'notifications.title': 'Notificaciones',
    'notifications.help': 'Recibe alertas en Slack o Discord cuando una métrica cruce un umbral. La URL del webhook solo vive en tu navegador; el servidor solo la reenvía, nunca la guarda.',
    'notifications.slackLabel': 'URL del webhook de Slack',
    'notifications.discordLabel': 'URL del webhook de Discord',
    'notifications.test': 'Probar',
    'notifications.testLabel': 'Alerta de prueba',
    'notifications.sending': 'Enviando…',
    'notifications.testSent': 'Alerta de prueba enviada',
    'notifications.testFailed': 'No se pudo enviar — revisa la URL',
    'notifications.noUrl': 'Introduce una URL primero',
    'settings.warnLabel': 'Aviso, %', 'settings.badLabel': 'Crítico, %',
    'settings.getKey': 'obtener clave', 'settings.configured': 'configurado',
    'about.title': 'Acerca de',
    'about.subtitle': 'Panel local de límites — sin saltar entre consolas de proveedores.',
    'about.intro': 'Esta app standalone consulta las APIs con una petición pequeña y lee <strong>cabeceras rate-limit</strong> o endpoints dedicados (<code>/api/v1/auth/key</code> en OpenRouter):',
    'about.bulletAnthropic': '<strong>Anthropic</strong> — <code>anthropic-ratelimit-*</code> (RPM + input/output TPM).',
    'about.bulletOpenAICompat': '<strong>OpenAI / Groq / Fireworks / Mistral / Together</strong> — <code>x-ratelimit-*</code> (RPM + TPM).',
    'about.bulletOpenRouter': '<strong>OpenRouter</strong> — balance de créditos y rate limit desde <code>/api/v1/auth/key</code>.',
    'about.bulletGemini': '<strong>Gemini</strong> — sin cabeceras rate-limit; estado por 200/429.',
    'about.subsNote': 'Los límites de suscripción (Claude Pro/Max, ChatGPT Plus/Pro, Gemini Advanced) no están expuestos vía API — son métricas internas de la UI. Aquí ves los límites de tu <em>cuenta de API</em>.',
    'gemini.note200': 'API accesible. Los límites exactos no se publican — vigilamos los 429.',
    'deepseek.balanceLabel': 'Saldo',
    'deepseek.insufficient': 'Saldo insuficiente — recarga en platform.deepseek.com',
    'gemini.note429': 'Cuota superada (429).', 'gemini.noteAuth': 'Clave inválida o sin permisos.', 'gemini.noteOther': 'Estado {status}',
    'reset.window': 'ventana 1 min',
  },
  ja: {
    'nav.dashboard': 'ダッシュボード', 'nav.providers': 'プロバイダー', 'nav.alerts': 'アラート', 'nav.about': 'このアプリについて',
    'providers.title': 'プロバイダー',
    'providers.subtitle': '8 つの LLM API を 1 つのダッシュボードで。キーはブラウザのみに保存され、サーバーは保存しません。',
    'alerts.title': 'アラート',
    'alerts.subtitle': 'リミットが近づいたら、いつ・どこへ通知するか。',
    'dashboard.title': 'プロバイダー別レート制限',
    'dashboard.subtitle': '8 つのコンソールを巡る代わりに一目で。キーはブラウザにのみ保存され、プロキシはプローブを中継するだけです。',
    'toolbar.refresh': 'すべて更新', 'toolbar.refreshing': '更新中…',
    'toolbar.autoOn': '自動 · オン', 'toolbar.autoOff': '自動 · オフ',
    'toolbar.lastChecked': '{time} に更新', 'toolbar.never': '未更新',
    'health.healthy': '正常', 'health.warn': '接近', 'health.bad': '上限間近', 'health.idle': '未設定',
    'card.notConfigured': '未設定', 'card.waiting': '待機中',
    'card.empty': '追跡を開始するには、設定で API キーを追加してください。',
    'card.refreshFirst': '「すべて更新」を押して制限を取得します。',
    'card.statusOk': 'OK', 'card.statusWarn': '接近', 'card.statusBad': '上限間近',
    'card.statusError': 'エラー', 'card.statusAuth': '認証', 'card.statusHttp': 'HTTP {status}',
    'card.openSettings': '設定を開く',
    'alert.providerError': 'HTTP {status} — キーまたはクォータを確認してください。',
    'alert.atPct': '{label} {pct}%',
    'empty.heroTitle': 'キーを追加すると制限が見えます',
    'empty.heroBody': '対応する 8 つのプロバイダーの API キーを接続して、すべての rate limit を一箇所で追跡。登録不要、サーバー側に何も保存しません。',
    'empty.heroCta': '設定を開く',
    'settings.title': '設定',
    'settings.subtitle': 'キーはブラウザのローカル (localStorage) にのみ保存されます。サーバーは保存しません。',
    'settings.show': '表示', 'settings.hide': '隠す',
    'settings.thresholds': 'アラートしきい値',
    'settings.thresholdsHelp': '使用率が何 % で警告と重大アラートを出すか。',
    'notifications.title': '通知',
    'notifications.help': 'メトリクスがしきい値を超えたら Slack や Discord に通知。Webhook URL はブラウザのみに保存され、サーバーは中継するだけで保存しません。',
    'notifications.slackLabel': 'Slack Webhook URL',
    'notifications.discordLabel': 'Discord Webhook URL',
    'notifications.test': 'テスト',
    'notifications.testLabel': 'テストアラート',
    'notifications.sending': '送信中…',
    'notifications.testSent': 'テストアラート送信済み',
    'notifications.testFailed': '送信失敗 — URL を確認',
    'notifications.noUrl': 'まず URL を入力',
    'settings.warnLabel': '警告 %', 'settings.badLabel': '重大 %',
    'settings.getKey': 'キーを取得', 'settings.configured': '設定済み',
    'about.title': 'このアプリについて',
    'about.subtitle': '各プロバイダーのコンソールを行き来せずに済むローカル制限ダッシュボード。',
    'about.intro': 'このスタンドアロンアプリは小さなリクエストでプロバイダー API をプローブし、<strong>rate-limit ヘッダー</strong>または専用エンドポイント（OpenRouter の <code>/api/v1/auth/key</code>）を読み取ります：',
    'about.bulletAnthropic': '<strong>Anthropic</strong> — <code>anthropic-ratelimit-*</code>（RPM + 入力/出力 TPM）。',
    'about.bulletOpenAICompat': '<strong>OpenAI / Groq / Fireworks / Mistral / Together</strong> — <code>x-ratelimit-*</code>（RPM + TPM）。',
    'about.bulletOpenRouter': '<strong>OpenRouter</strong> — <code>/api/v1/auth/key</code> からクレジット残高と rate limit。',
    'about.bulletGemini': '<strong>Gemini</strong> — rate-limit ヘッダーは無し；ステータスは 200/429 から判定。',
    'about.subsNote': 'サブスクリプション制限（Claude Pro/Max、ChatGPT Plus/Pro、Gemini Advanced）は API では公開されていません — UI 内部の指標です。ここでは <em>API アカウント</em> の制限を表示しています。',
    'gemini.note200': 'API 利用可能。正確な制限は非公開のため、429 を監視します。',
    'deepseek.balanceLabel': '残高',
    'deepseek.insufficient': '残高不足 — platform.deepseek.com でチャージしてください',
    'gemini.note429': 'クォータ超過 (429)。', 'gemini.noteAuth': 'キーが無効、または権限がありません。', 'gemini.noteOther': 'ステータス {status}',
    'reset.window': '1 分ウィンドウ',
  },
  zh: {
    'nav.dashboard': '仪表板', 'nav.providers': '提供商', 'nav.alerts': '告警', 'nav.about': '关于',
    'providers.title': '提供商',
    'providers.subtitle': '八个 LLM API 在一个仪表板里。密钥仅保存在浏览器本地，服务器不会存储。',
    'alerts.title': '告警',
    'alerts.subtitle': '何时、向何处通知你限额即将耗尽。',
    'dashboard.title': '各提供商限额',
    'dashboard.subtitle': '一屏胜过八个控制台。密钥仅保存在浏览器中，代理只在探测时使用。',
    'toolbar.refresh': '全部刷新', 'toolbar.refreshing': '刷新中…',
    'toolbar.autoOn': '自动 · 开', 'toolbar.autoOff': '自动 · 关',
    'toolbar.lastChecked': '已更新 {time}', 'toolbar.never': '尚未更新',
    'health.healthy': '正常', 'health.warn': '接近', 'health.bad': '临界', 'health.idle': '未配置',
    'card.notConfigured': '未配置', 'card.waiting': '等待中',
    'card.empty': '在设置中添加 API 密钥以开始跟踪。',
    'card.refreshFirst': '点击「全部刷新」以查询限额。',
    'card.statusOk': '正常', 'card.statusWarn': '接近', 'card.statusBad': '临界',
    'card.statusError': '错误', 'card.statusAuth': '认证', 'card.statusHttp': 'HTTP {status}',
    'card.openSettings': '打开设置',
    'alert.providerError': 'HTTP {status} — 请检查密钥或配额。',
    'alert.atPct': '{label} 已达 {pct}%',
    'empty.heroTitle': '添加密钥即可查看限额',
    'empty.heroBody': '连接八个支持的提供商的 API 密钥，在一个地方跟踪所有速率限制。无需注册，服务器不存储任何信息。',
    'empty.heroCta': '打开设置',
    'settings.title': '设置',
    'settings.subtitle': '密钥仅保存在浏览器本地 (localStorage)，服务器不会存储。',
    'settings.show': '显示', 'settings.hide': '隐藏',
    'settings.thresholds': '告警阈值',
    'settings.thresholdsHelp': '在使用率达到多少 % 时显示警告与严重告警。',
    'notifications.title': '通知',
    'notifications.help': '当指标越过阈值时，向 Slack 或 Discord 发送告警。Webhook URL 仅保存在浏览器；服务器只转发，不存储。',
    'notifications.slackLabel': 'Slack Webhook URL',
    'notifications.discordLabel': 'Discord Webhook URL',
    'notifications.test': '测试',
    'notifications.testLabel': '测试告警',
    'notifications.sending': '发送中…',
    'notifications.testSent': '测试告警已发送',
    'notifications.testFailed': '发送失败 — 请检查 URL',
    'notifications.noUrl': '请先输入 URL',
    'settings.warnLabel': '警告，%', 'settings.badLabel': '严重，%',
    'settings.getKey': '获取密钥', 'settings.configured': '已配置',
    'about.title': '关于',
    'about.subtitle': '本地限额仪表板 — 不再在各家控制台间切换。',
    'about.intro': '这是一个独立应用，向每个提供商发送微小请求并读取 <strong>rate-limit 响应头</strong>或 OpenRouter 上的专用接口 (<code>/api/v1/auth/key</code>)：',
    'about.bulletAnthropic': '<strong>Anthropic</strong> — <code>anthropic-ratelimit-*</code> (RPM + 输入/输出 TPM)。',
    'about.bulletOpenAICompat': '<strong>OpenAI / Groq / Fireworks / Mistral / Together</strong> — <code>x-ratelimit-*</code> (RPM + TPM)。',
    'about.bulletOpenRouter': '<strong>OpenRouter</strong> — 通过 <code>/api/v1/auth/key</code> 获取额度余额和 rate limit。',
    'about.bulletGemini': '<strong>Gemini</strong> — 不返回 rate-limit 响应头；状态依据 200/429 判断。',
    'about.subsNote': '订阅类限额（Claude Pro/Max、ChatGPT Plus/Pro、Gemini Advanced）不通过 API 暴露——它们是封闭的 UI 指标。这里显示的是你的 <em>API 账户</em>限额。',
    'gemini.note200': 'API 可用。具体限额未公布 — 关注 429 错误。',
    'deepseek.balanceLabel': '余额',
    'deepseek.insufficient': '余额不足 — 请在 platform.deepseek.com 充值',
    'gemini.note429': '已超出配额 (429)。', 'gemini.noteAuth': '密钥无效或权限不足。', 'gemini.noteOther': '状态 {status}',
    'reset.window': '1 分钟窗口',
  },
};

const STORAGE_KEY = 'llm-limits-tracker.v2';
const THEME_KEY = 'llm-limits-tracker.theme';
const LANG_KEY = 'llm-limits-tracker.lang';
const AURORA_KEY = 'llm-limits-tracker.aurora';

function detectLang() {
  const n = (navigator.language || 'en').toLowerCase();
  if (n.startsWith('ru')) return 'ru';
  if (n.startsWith('es')) return 'es';
  if (n.startsWith('zh')) return 'zh';
  if (n.startsWith('ja')) return 'ja';
  return 'en';
}
let currentLang = localStorage.getItem(LANG_KEY) || detectLang();
function t(key, vars) {
  let s = (T[currentLang] && T[currentLang][key]) || T.en[key] || key;
  if (vars) for (const k in vars) s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
  return s;
}

// ===== Provider registry — `name` + `subtitle` mirrors the card design. =====
const PROVIDERS = [
  { id: 'anthropic',  name: 'Anthropic',  subtitle: 'Claude API',         parser: 'anthropic',     placeholder: 'sk-ant-...',   getUrl: 'https://console.anthropic.com/settings/keys' },
  { id: 'openai',     name: 'OpenAI',     subtitle: 'ChatGPT API',        parser: 'openai-compat', placeholder: 'sk-...',       getUrl: 'https://platform.openai.com/api-keys' },
  { id: 'gemini',     name: 'Google',     subtitle: 'Gemini API',         parser: 'gemini',        placeholder: 'AIza...',      getUrl: 'https://aistudio.google.com/app/apikey' },
  { id: 'openrouter', name: 'OpenRouter', subtitle: 'Multi-provider',     parser: 'openrouter',    placeholder: 'sk-or-v1-...', getUrl: 'https://openrouter.ai/keys' },
  { id: 'groq',       name: 'Groq',       subtitle: 'Fast inference',     parser: 'openai-compat', placeholder: 'gsk_...',      getUrl: 'https://console.groq.com/keys' },
  { id: 'deepseek',   name: 'DeepSeek',   subtitle: 'deepseek-chat · R1', parser: 'deepseek',      placeholder: 'sk-...',       getUrl: 'https://platform.deepseek.com/api_keys' },
];

const state = {
  keys: Object.fromEntries(PROVIDERS.map((p) => [p.id, ''])),
  thresholds: { warn: 80, bad: 95 },
  lastResults: Object.fromEntries(PROVIDERS.map((p) => [p.id, null])),
  lastChecked: null,
  autoRefresh: false,
  // Outgoing webhook URLs (Slack / Discord). Empty string = disabled.
  webhooks: { slack: '', discord: '' },
  // Last severity per `${providerId}.${metricLabel}`. Used by checkAndNotify
  // to fire a webhook ONLY on upward transitions (ok→warn, warn→bad, ok→bad)
  // — re-firing on every refresh would spam the channel.
  alertedState: {},
};
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved) return;
    if (saved.keys) Object.assign(state.keys, saved.keys);
    if (saved.thresholds) Object.assign(state.thresholds, saved.thresholds);
    if (typeof saved.autoRefresh === 'boolean') state.autoRefresh = saved.autoRefresh;
    if (saved.webhooks) Object.assign(state.webhooks, saved.webhooks);
    if (saved.alertedState && typeof saved.alertedState === 'object') state.alertedState = saved.alertedState;
  } catch (_) {}
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    keys: state.keys,
    thresholds: state.thresholds,
    autoRefresh: state.autoRefresh,
    webhooks: state.webhooks,
    alertedState: state.alertedState,
  }));
}

// ===== Themes: system / glass-light / glass-dark / hacker =====
// `system` resolves to glass-light or glass-dark via prefers-color-scheme.
const VALID_THEMES = new Set(['system', 'glass-light', 'glass-dark', 'hacker']);
function applyTheme() {
  let pref = localStorage.getItem(THEME_KEY) || 'system';
  if (!VALID_THEMES.has(pref)) pref = 'system';
  const resolved = pref === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'glass-dark' : 'glass-light')
    : pref;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePref = pref;
  document.querySelectorAll('#theme-pills button').forEach((b) => {
    b.classList.toggle('active', b.dataset.themePick === pref);
  });
}
document.querySelectorAll('#theme-pills button').forEach((btn) => {
  btn.addEventListener('click', () => {
    localStorage.setItem(THEME_KEY, btn.dataset.themePick);
    applyTheme();
  });
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

// ===== Aurora toggle =====
// Drops the colourful page backdrops in glass themes. Visibility of the
// button itself is CSS-driven (only shown when data-theme is a glass variant).
function applyAurora() {
  const off = localStorage.getItem(AURORA_KEY) === 'off';
  document.documentElement.dataset.aurora = off ? 'off' : 'on';
  const btn = document.getElementById('aurora-toggle');
  if (btn) btn.setAttribute('aria-pressed', off ? 'false' : 'true');
}
document.getElementById('aurora-toggle').addEventListener('click', () => {
  const cur = localStorage.getItem(AURORA_KEY) || 'on';
  localStorage.setItem(AURORA_KEY, cur === 'on' ? 'off' : 'on');
  applyAurora();
});

// ===== Tabs =====
document.querySelectorAll('.sb-nav button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sb-nav button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    ['dashboard', 'providers', 'alerts', 'about'].forEach((tt) => {
      document.getElementById(`tab-${tt}`).classList.toggle('hidden', tt !== tab);
    });
  });
});

// ===== Language picker =====
function setLang(l) {
  currentLang = l;
  localStorage.setItem(LANG_KEY, l);
  document.documentElement.lang = l;
  document.querySelectorAll('#lang-pills button').forEach((b) => b.classList.toggle('active', b.dataset.lang === l));
  applyAllStrings();
}
document.querySelectorAll('#lang-pills button').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

function applyAllStrings() {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.documentElement.lang = currentLang;
  renderSettings();
  renderProviders();
  renderAbout();
  document.getElementById('refresh-btn').textContent = t('toolbar.refresh');
  applyAutoRefresh();
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ===== Probe =====
async function probe(providerId) {
  const key = state.keys[providerId];
  if (!key) return { error: 'no_key' };
  try {
    const resp = await fetch(`/api/probe/${providerId}`, {
      method: 'POST',
      headers: { 'X-Provider-Key': key, 'Content-Type': 'application/json' },
    });
    if (!resp.ok) return { error: 'proxy_error', detail: await resp.text() };
    return await resp.json();
  } catch (e) {
    return { error: 'network', detail: String(e) };
  }
}

// ===== Parsers =====
function parseHeaderNum(v) {
  if (v == null) return NaN;
  const s = String(v).trim();
  const m = s.match(/^(\d+(?:\.\d+)?)([kKmM]?)$/);
  if (!m) return Number(s);
  const base = Number(m[1]);
  const suf = m[2].toLowerCase();
  return suf === 'k' ? base * 1e3 : suf === 'm' ? base * 1e6 : base;
}
function parseAnthropic(result) {
  if (!result || result.error) return { error: result && result.error, detail: result && result.detail };
  const h = result.headers || {};
  const metrics = [];
  const tryAdd = (label, lk, rk) => {
    const limit = parseHeaderNum(h[lk]); const remaining = parseHeaderNum(h[rk]);
    if (Number.isFinite(limit) && Number.isFinite(remaining) && limit > 0) metrics.push({ label, used: Math.max(0, limit - remaining), limit });
  };
  tryAdd('Requests / min',      'anthropic-ratelimit-requests-limit',      'anthropic-ratelimit-requests-remaining');
  tryAdd('Input tokens / min',  'anthropic-ratelimit-input-tokens-limit',  'anthropic-ratelimit-input-tokens-remaining');
  tryAdd('Output tokens / min', 'anthropic-ratelimit-output-tokens-limit', 'anthropic-ratelimit-output-tokens-remaining');
  tryAdd('Tokens / min',        'anthropic-ratelimit-tokens-limit',        'anthropic-ratelimit-tokens-remaining');
  return { metrics, errored: result.status >= 400, status: result.status, raw: result };
}
function parseOpenAICompat(result) {
  if (!result || result.error) return { error: result && result.error, detail: result && result.detail };
  const h = result.headers || {};
  const metrics = [];
  const tryAdd = (label, lk, rk) => {
    const limit = parseHeaderNum(h[lk]); const remaining = parseHeaderNum(h[rk]);
    if (Number.isFinite(limit) && Number.isFinite(remaining) && limit > 0) metrics.push({ label, used: Math.max(0, limit - remaining), limit });
  };
  tryAdd('Requests / min', 'x-ratelimit-limit-requests', 'x-ratelimit-remaining-requests');
  tryAdd('Tokens / min',   'x-ratelimit-limit-tokens',   'x-ratelimit-remaining-tokens');
  if (metrics.length === 0) tryAdd('Requests', 'x-ratelimit-limit', 'x-ratelimit-remaining');
  return { metrics, errored: result.status >= 400, status: result.status, raw: result };
}
function parseGemini(result) {
  if (!result || result.error) return { error: result && result.error, detail: result && result.detail };
  const status = result.status;
  let note = '';
  if (status === 200) note = t('gemini.note200');
  else if (status === 429) note = t('gemini.note429');
  else if (status === 401 || status === 403) note = t('gemini.noteAuth');
  else note = t('gemini.noteOther', { status });
  return { metrics: [], errored: status >= 400, status, note, raw: result };
}
function parseOpenRouter(result) {
  if (!result || result.error) return { error: result && result.error, detail: result && result.detail };
  if (result.status >= 400) return { metrics: [], errored: true, status: result.status, raw: result };
  const data = (result.body && result.body.data) || {};
  const metrics = [];
  if (typeof data.usage === 'number' && typeof data.limit === 'number' && data.limit > 0) {
    metrics.push({ label: 'Credits used', used: data.usage, limit: data.limit, unit: 'credits' });
  } else if (typeof data.usage === 'number') {
    metrics.push({ label: 'Credits used', used: data.usage, limit: 0, unit: 'credits', informational: true });
  }
  // OpenRouter quirk: free-tier accounts return rate_limit.requests = -1
  // ("no fixed limit"). Skip the rate-limit line entirely in that case so we
  // don't render a literal "-1 req / 10s".
  let note = '';
  const rl = data.rate_limit;
  if (rl && typeof rl.requests === 'number' && rl.requests > 0 && rl.interval) {
    note = `${rl.requests} req / ${rl.interval}`;
  }
  if (data.is_free_tier) note = (note ? note + ' · ' : '') + 'free tier';
  return { metrics, errored: false, status: result.status, note, raw: result };
}
// DeepSeek probes /user/balance instead of /chat/completions — the chat endpoint
// doesn't return rate-limit headers, but balance gives us real, useful USD/CNY
// numbers. is_available: false means "insufficient balance" → treat as error.
function parseDeepSeek(result) {
  if (!result || result.error) return { error: result && result.error, detail: result && result.detail };
  if (result.status >= 400) return { metrics: [], errored: true, status: result.status, raw: result };
  const data = result.body || {};
  if (data.is_available === false) {
    return { metrics: [], errored: true, status: 402, note: t('deepseek.insufficient'), raw: result };
  }
  const metrics = [];
  if (Array.isArray(data.balance_infos)) {
    data.balance_infos.forEach((info) => {
      const balance = Number(info.total_balance);
      if (!Number.isFinite(balance)) return;
      const symbol = info.currency === 'USD' ? '$' : info.currency === 'CNY' ? '¥' : '';
      const display = symbol ? `${symbol}${balance.toFixed(2)}` : `${balance.toFixed(2)} ${info.currency || ''}`;
      metrics.push({
        label: t('deepseek.balanceLabel'),
        used: display,           // pre-formatted; fmtNum passes strings through
        limit: 0,
        informational: true,
      });
    });
  }
  return { metrics, errored: false, status: result.status, raw: result };
}

const PARSERS = {
  'anthropic':     parseAnthropic,
  'openai-compat': parseOpenAICompat,
  'gemini':        parseGemini,
  'openrouter':    parseOpenRouter,
  'deepseek':      parseDeepSeek,
};

function pctClass(pct) {
  if (pct >= state.thresholds.bad) return 'bad';
  if (pct >= state.thresholds.warn) return 'warn';
  return 'good';
}
function fmtNum(n) {
  if (!Number.isFinite(n)) return String(n);
  if (n >= 1000) return n.toLocaleString();
  return n.toFixed(n < 10 && n % 1 !== 0 ? 3 : 0);
}

function cardSeverity(p) {
  const data = state.lastResults[p.id];
  const hasKey = !!state.keys[p.id];
  if (!hasKey) return 'idle';
  if (!data) return 'idle';
  if (data.error || data.errored) return 'error';
  let topPct = 0;
  (data.metrics || []).forEach((m) => {
    if (m.informational || !m.limit) return;
    const pct = (m.used / m.limit) * 100;
    if (pct > topPct) topPct = pct;
  });
  if (topPct >= state.thresholds.bad) return 'bad';
  if (topPct >= state.thresholds.warn) return 'warn';
  return 'good';
}

function sortedProviders() {
  const rank = { bad: 0, error: 1, warn: 2, good: 3, idle: 4 };
  return PROVIDERS.map((p, i) => ({ p, i, sev: cardSeverity(p) }))
    .sort((a, b) => rank[a.sev] - rank[b.sev] || a.i - b.i)
    .map((x) => x.p);
}

// ===== Settings =====
function renderSettings() {
  const help = {
    ru: {
      anthropic:  'Обычный <code>sk-ant-...</code> даёт rate limits. Admin-ключ — отчёт по расходам.',
      openai:     'Обычный API-ключ. Admin-ключ организации — для cost-отчёта.',
      gemini:     'Из Google AI Studio. Заголовков rate-limit у Gemini нет — следим по 429.',
      openrouter: 'Показывает баланс кредитов и rate limit (запросов / интервал).',
      groq:       'OpenAI-совместимый API.',
      deepseek:   'Из platform.deepseek.com. Показываем актуальный USD/CNY-баланс через <code>/user/balance</code>.',
    },
    en: {
      anthropic:  'Standard <code>sk-ant-...</code> gives rate limits. Admin key unlocks cost report.',
      openai:     'Standard API key. Org admin key needed for cost report.',
      gemini:     "From Google AI Studio. Gemini doesn't expose rate-limit headers — we watch for 429s.",
      openrouter: 'Shows credit balance and rate limit (requests / interval).',
      groq:       'OpenAI-compatible API.',
      deepseek:   'From platform.deepseek.com. We poll <code>/user/balance</code> to show your live USD/CNY balance.',
    },
    es: {
      anthropic:  'Clave estándar <code>sk-ant-...</code> da rate limits. Admin desbloquea costes.',
      openai:     'Clave estándar. Para costes hace falta clave admin de la organización.',
      gemini:     'Desde Google AI Studio. Gemini no expone cabeceras rate-limit — seguimos los 429.',
      openrouter: 'Muestra balance de créditos y rate limit (peticiones / intervalo).',
      groq:       'API compatible con OpenAI.',
      deepseek:   'De platform.deepseek.com. Consultamos <code>/user/balance</code> para mostrar tu saldo USD/CNY en vivo.',
    },
    zh: {
      anthropic:  '普通 <code>sk-ant-...</code> 提供限额，Admin 密钥提供费用报告。',
      openai:     '普通 API 密钥；组织 Admin 密钥用于费用报告。',
      gemini:     '来自 Google AI Studio。Gemini 不暴露 rate-limit 响应头 — 通过 429 监测。',
      openrouter: '显示额度余额和 rate limit（每段时间请求数）。',
      groq:       'OpenAI 兼容 API。',
      deepseek:   '来自 platform.deepseek.com。通过 <code>/user/balance</code> 显示当前 USD/CNY 余额。',
    },
    ja: {
      anthropic:  '通常の <code>sk-ant-...</code> でレート制限を取得。Admin キーで費用レポート。',
      openai:     '通常の API キー。費用レポートには組織 Admin キーが必要。',
      gemini:     'Google AI Studio から取得。Gemini は rate-limit ヘッダーを返さないため、429 を監視。',
      openrouter: 'クレジット残高と rate limit（リクエスト数 / 間隔）を表示。',
      groq:       'OpenAI 互換 API。',
      deepseek:   'platform.deepseek.com から。<code>/user/balance</code> で USD/CNY 残高を表示。',
    },
  };
  const localHelp = help[currentLang] || help.en;
  const cardsHtml = PROVIDERS.map((p, i) => `
    <div class="card" style="animation-delay: ${i * 30}ms">
      <div class="c-head">
        <div class="c-prov">${escapeHtml(p.name)}<small>${escapeHtml(p.subtitle)}</small></div>
        ${state.keys[p.id] ? `<span class="configured-tag">${escapeHtml(t('settings.configured'))}</span>` : ''}
      </div>
      <p class="help">${localHelp[p.id]} · <a href="${p.getUrl}" target="_blank" rel="noopener">${escapeHtml(t('settings.getKey'))}</a></p>
      <div class="key-row">
        <input type="password" data-key="${p.id}" placeholder="${escapeHtml(p.placeholder)}" value="${escapeHtml(state.keys[p.id] || '')}" />
        <button type="button" class="show-key" data-target="${p.id}">${escapeHtml(t('settings.show'))}</button>
      </div>
    </div>
  `).join('');
  document.getElementById('settings-grid').innerHTML = cardsHtml;
  document.getElementById('threshold-warn').value = state.thresholds.warn;
  document.getElementById('threshold-bad').value = state.thresholds.bad;
  document.querySelectorAll('.show-key').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(`input[data-key="${btn.dataset.target}"]`);
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.textContent = showing ? t('settings.show') : t('settings.hide');
    });
  });
  // Auto-save key on blur (change). Updates state, refreshes the dashboard,
  // and probes immediately when a brand-new key appears so the user doesn't
  // have to click "Refresh all". Doesn't re-render the settings grid (would
  // steal focus from the next input); the configured tag is patched inline.
  document.querySelectorAll('input[data-key]').forEach((el) => {
    el.addEventListener('change', async () => {
      const id = el.dataset.key;
      const oldVal = state.keys[id] || '';
      const newVal = el.value.trim();
      if (oldVal === newVal) return;
      state.keys[id] = newVal;
      saveState();
      if (!newVal) state.lastResults[id] = null;
      // Patch the configured tag inline (no re-render) so focus stays on
      // whichever input the user is about to fill next.
      const headDiv = el.closest('.card').querySelector('.c-head');
      const existingTag = headDiv.querySelector('.configured-tag');
      if (newVal && !existingTag) {
        const tag = document.createElement('span');
        tag.className = 'configured-tag';
        tag.textContent = t('settings.configured');
        headDiv.appendChild(tag);
      } else if (!newVal && existingTag) {
        existingTag.remove();
      }
      renderProviders();
      // Auto-probe only when a key is freshly added (not on edits / removals).
      if (!oldVal && newVal) {
        const r = await probe(id);
        if (r && r.error === 'no_key') return;
        const prov = PROVIDERS.find((p) => p.id === id);
        state.lastResults[id] = PARSERS[prov.parser](r);
        state.lastChecked = Date.now();
        renderProviders();
        firePulse();
      }
    });
  });
}

// Threshold inputs: persist on change, redraw the dashboard so colour/severity
// thresholds update live. Attached once — the DOM nodes live in static HTML.
['threshold-warn', 'threshold-bad'].forEach((id) => {
  document.getElementById(id).addEventListener('change', () => {
    state.thresholds.warn = Number(document.getElementById('threshold-warn').value) || 80;
    state.thresholds.bad = Number(document.getElementById('threshold-bad').value) || 95;
    saveState();
    renderProviders();
  });
});

// Webhook URL inputs — auto-save on blur, no Save button.
['slack', 'discord'].forEach((kind) => {
  const input = document.getElementById(`webhook-${kind}`);
  if (!input) return;
  input.value = state.webhooks[kind] || '';
  input.addEventListener('change', () => {
    state.webhooks[kind] = input.value.trim();
    saveState();
  });
});

// "Test" buttons next to each webhook input — fire a one-off synthetic alert
// so the user can verify the URL works before relying on it.
document.querySelectorAll('.test-webhook').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const kind = btn.dataset.target;
    const url = (state.webhooks[kind] || '').trim();
    if (!url) { flash(t('notifications.noUrl')); return; }
    const fake = [{
      provider: 'LLM Limits',
      label: t('notifications.testLabel'),
      used: 95, limit: 100, pct: 95, sev: 'bad',
    }];
    const payload = kind === 'slack' ? formatSlackPayload(fake) : formatDiscordPayload(fake);
    btn.disabled = true;
    const orig = btn.textContent;
    btn.textContent = t('notifications.sending');
    const ok = await sendWebhook(url, payload);
    btn.textContent = orig;
    btn.disabled = false;
    flash(t(ok ? 'notifications.testSent' : 'notifications.testFailed'));
  });
});

// ===== Card / dashboard rendering =====
function renderMetric(m, hero) {
  if (m.informational) {
    return `
      <div class="metric${hero ? ' hero' : ''}">
        <div class="m-row">
          <span class="m-lbl">${escapeHtml(m.label)}</span>
          <span class="m-num">${fmtNum(m.used)} ${escapeHtml(m.unit || '')}</span>
        </div>
      </div>`;
  }
  const pct = Math.min(100, Math.round((m.used / m.limit) * 100));
  const cls = pctClass(pct);
  // Visible progress at sub-1%: tiny non-zero usage gets bumped so the inner
  // bar isn't completely empty.
  const barPct = pct > 0 ? Math.max(pct, 1.5) : 0;
  return `
    <div class="metric${hero ? ' hero' : ''}">
      <div class="m-row">
        <span class="m-lbl">${escapeHtml(m.label)}</span>
        <span class="m-num">${fmtNum(m.used)} / ${fmtNum(m.limit)}</span>
        <span class="m-pct">${pct}%</span>
      </div>
      <div class="bar ${cls}"><i class="${cls}" style="width: ${barPct}%"></i></div>
    </div>`;
}

// Pull a clean human-readable line out of an upstream error response. Provider
// error bodies are often huge (Gemini's 429 dumps whole docs URLs and quota
// metric paths). We extract the gist: status code, retry-in if available, and
// a truncated message — anything more belongs in the network tab, not the UI.
function formatUpstreamError(data, status) {
  const body = data && data.raw && data.raw.body;
  const err = body && body.error;
  if (!err) return `Status ${status}`;

  // Gemini-style retryDelay (e.g. "54s" buried in error.details[*].retryDelay).
  let retry = '';
  if (Array.isArray(err.details)) {
    const ri = err.details.find((d) => d && (d.retryDelay || d['@type']?.includes('RetryInfo')));
    if (ri && ri.retryDelay) retry = ` · retry in ${ri.retryDelay}`;
  }

  // First-sentence-only truncation. Gemini's message is paragraphs of text plus
  // doc URLs; the first sentence carries the actual reason.
  const raw = err.message || JSON.stringify(err);
  const firstSentence = raw.split(/\.\s+/)[0].slice(0, 160);
  const ellipsis = raw.length > firstSentence.length ? '…' : '';
  return `${firstSentence}${ellipsis}${retry}`;
}

function renderProvider(p, idx) {
  const data = state.lastResults[p.id];
  const hasKey = !!state.keys[p.id];
  const sev = cardSeverity(p);
  const cardClasses = ['card'];
  if (sev === 'warn' || sev === 'bad') cardClasses.push(sev);

  let pillClass = 'pill';
  let pillText = '';
  let body = '';
  let foot = '';

  if (!hasKey) {
    pillClass = 'pill idle';
    pillText = t('card.notConfigured');
    body = `<div class="idle-msg">${escapeHtml(t('card.empty'))}</div>
      <div class="idle-cta"><a data-go-settings>${escapeHtml(t('card.openSettings'))} →</a></div>`;
  } else if (!data) {
    pillClass = 'pill idle';
    pillText = t('card.waiting');
    body = `<div class="idle-msg">${escapeHtml(t('card.refreshFirst'))}</div>`;
  } else if (data.error) {
    pillClass = 'pill bad';
    pillText = t('card.statusError');
    body = `<div class="err-block">${escapeHtml(data.detail || data.error)}</div>`;
  } else if (data.errored) {
    const status = data.status;
    const isAuth = status === 401 || status === 403;
    pillClass = 'pill bad';
    pillText = isAuth ? t('card.statusAuth') : t('card.statusHttp', { status });
    body = `<div class="err-block">${escapeHtml(formatUpstreamError(data, status))}</div>`;
  } else {
    if (sev === 'bad')      { pillClass = 'pill bad';  pillText = t('card.statusBad'); }
    else if (sev === 'warn') { pillClass = 'pill warn'; pillText = t('card.statusWarn'); }
    else                     { pillClass = 'pill';      pillText = t('card.statusOk'); }

    const footLeft = state.lastChecked
      ? new Date(state.lastChecked).toLocaleTimeString(currentLang === 'zh' ? 'zh-CN' : currentLang)
      : '';
    if (data.metrics && data.metrics.length) {
      const sorted = [...data.metrics].sort((a, b) => {
        if (a.informational && !b.informational) return 1;
        if (b.informational && !a.informational) return -1;
        if (a.informational || b.informational) return 0;
        return (b.used / b.limit) - (a.used / a.limit);
      });
      body = sorted.map((m, i) => renderMetric(m, i === 0)).join('');
      const footRight = data.note ? data.note : t('reset.window');
      foot = `<div class="c-foot"><span>${escapeHtml(footLeft)}</span><span class="right">${escapeHtml(footRight)}</span></div>`;
    } else {
      // OK probe but no metrics surfaced (Gemini, OpenRouter free-tier without
      // credit cap, etc.). Render an info row so the card looks intentional —
      // not a half-broken idle state.
      body = `<div class="info-msg"><span class="info-dot"></span>${escapeHtml(data.note || '—')}</div>`;
      foot = `<div class="c-foot"><span>${escapeHtml(footLeft)}</span><span class="right">${escapeHtml(t('reset.window'))}</span></div>`;
    }
  }

  return `
    <div class="${cardClasses.join(' ')}" data-provider="${p.id}" style="animation-delay: ${idx * 30}ms">
      <div class="c-head">
        <div class="c-prov">${escapeHtml(p.name)}<small>${escapeHtml(p.subtitle)}</small></div>
        <span class="${pillClass}">${escapeHtml(pillText)}</span>
      </div>
      ${body}
      ${foot}
    </div>`;
}

function renderProviders() {
  const body = document.getElementById('dashboard-body');
  const anyKey = PROVIDERS.some((p) => state.keys[p.id]);

  if (!anyKey) {
    body.innerHTML = `
      <div class="hero-empty">
        <h3>${escapeHtml(t('empty.heroTitle'))}</h3>
        <p>${escapeHtml(t('empty.heroBody'))}</p>
        <button class="btn-primary" id="open-settings-cta">${escapeHtml(t('empty.heroCta'))}</button>
      </div>`;
    document.getElementById('open-settings-cta').addEventListener('click', () => {
      document.querySelector('.sb-nav button[data-tab="providers"]').click();
    });
  } else {
    const ordered = sortedProviders();
    body.innerHTML = `<div class="grid">${ordered.map((p, i) => renderProvider(p, i)).join('')}</div>`;
    body.querySelectorAll('[data-go-settings]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.sb-nav button[data-tab="providers"]').click();
      });
    });
  }
  renderHealthChips();
  renderAlerts();
  const last = state.lastChecked;
  document.getElementById('last-checked').textContent = last
    ? t('toolbar.lastChecked', { time: new Date(last).toLocaleTimeString(currentLang === 'zh' ? 'zh-CN' : currentLang) })
    : t('toolbar.never');
}

function renderHealthChips() {
  const counts = { good: 0, warn: 0, bad: 0, idle: 0 };
  let configured = 0;
  PROVIDERS.forEach((p) => {
    if (state.keys[p.id]) configured++;
    const sev = cardSeverity(p);
    if (sev === 'error') counts.bad++;
    else if (sev === 'good') counts.good++;
    else if (sev === 'warn') counts.warn++;
    else if (sev === 'bad') counts.bad++;
    else counts.idle++;
  });
  const el = document.getElementById('chips');
  if (configured === 0) { el.innerHTML = ''; return; }
  const chips = [];
  chips.push(`<span class="chip"><span class="dot good"></span><b>${counts.good}</b> ${escapeHtml(t('health.healthy'))}</span>`);
  chips.push(`<span class="chip"><span class="dot warn"></span><b>${counts.warn}</b> ${escapeHtml(t('health.warn'))}</span>`);
  chips.push(`<span class="chip"><span class="dot bad"></span><b>${counts.bad}</b> ${escapeHtml(t('health.bad'))}</span>`);
  if (counts.idle > 0) chips.push(`<span class="chip"><b>${counts.idle}</b> ${escapeHtml(t('health.idle'))}</span>`);
  el.innerHTML = chips.join('');
}

function renderAlerts() {
  const items = [];
  PROVIDERS.forEach((p) => {
    const data = state.lastResults[p.id];
    if (!data || data.error) return;
    if (data.errored) {
      items.push({ sev: 'bad', sortKey: 0, prov: p.name, msg: t('alert.providerError', { status: data.status }) });
      return;
    }
    (data.metrics || []).forEach((m) => {
      if (m.informational || !m.limit) return;
      const pct = (m.used / m.limit) * 100;
      if (pct >= state.thresholds.bad) {
        items.push({ sev: 'bad', sortKey: -pct, prov: p.name, msg: t('alert.atPct', { label: m.label, pct: Math.round(pct) }) });
      } else if (pct >= state.thresholds.warn) {
        items.push({ sev: 'warn', sortKey: 100 - pct, prov: p.name, msg: t('alert.atPct', { label: m.label, pct: Math.round(pct) }) });
      }
    });
  });
  items.sort((a, b) => (a.sev === b.sev ? a.sortKey - b.sortKey : a.sev === 'bad' ? -1 : 1));
  const top = items.slice(0, 4);
  document.getElementById('alerts').innerHTML = top.map((a) => `
    <div class="alert ${a.sev}">
      <span class="a-prov">${escapeHtml(a.prov)}</span>
      <span class="a-msg">${escapeHtml(a.msg)}</span>
    </div>`).join('');
}

function renderAbout() {
  document.getElementById('about-card').innerHTML = `
    <p>${t('about.intro')}</p>
    <ul>
      <li>${t('about.bulletAnthropic')}</li>
      <li>${t('about.bulletOpenAICompat')}</li>
      <li>${t('about.bulletOpenRouter')}</li>
      <li>${t('about.bulletGemini')}</li>
    </ul>
    <p class="help">${t('about.subsNote')}</p>
  `;
}

// ===== Notifications (Slack / Discord webhooks) =====
//
// Browser can't POST to hooks.slack.com directly (CORS). The relay lives in
// server.js at /api/webhook/notify and re-POSTs server-to-server.
async function sendWebhook(targetUrl, payload) {
  try {
    const r = await fetch('/api/webhook/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl, payload }),
    });
    return r.ok;
  } catch (_) {
    return false;
  }
}

function formatSlackPayload(transitions) {
  const lines = transitions.map((tr) => {
    const emoji = tr.sev === 'bad' ? ':red_circle:' : ':warning:';
    const num = `${fmtNum(tr.used)} / ${fmtNum(tr.limit)}`;
    return `${emoji}  *${tr.provider}* — ${tr.label}: ${tr.pct}%  (${num})`;
  });
  const headline = transitions.length === 1
    ? 'LLM Limits — 1 alert'
    : `LLM Limits — ${transitions.length} alerts`;
  return {
    text: headline,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: headline } },
      { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') } },
    ],
  };
}

function formatDiscordPayload(transitions) {
  const lines = transitions.map((tr) => {
    const emoji = tr.sev === 'bad' ? '🔴' : '⚠️';
    return `${emoji} **${tr.provider}** — ${tr.label}: ${tr.pct}%  (${fmtNum(tr.used)} / ${fmtNum(tr.limit)})`;
  });
  const anyBad = transitions.some((tr) => tr.sev === 'bad');
  return {
    username: 'LLM Limits',
    embeds: [{
      title: transitions.length === 1 ? '1 alert' : `${transitions.length} alerts`,
      description: lines.join('\n'),
      // Embed sidebar colour matches our severity palette.
      color: anyBad ? 0xb94a4a : 0xc98e3f,
      timestamp: new Date().toISOString(),
    }],
  };
}

// Compute upward severity transitions since the last refresh. Updates
// state.alertedState in place and returns the list of transitions to alert on.
function computeTransitions() {
  const order = { ok: 0, warn: 1, bad: 2 };
  const newAlerted = {};
  const transitions = [];
  PROVIDERS.forEach((p) => {
    const data = state.lastResults[p.id];
    if (!data || data.error || data.errored) return;
    (data.metrics || []).forEach((m) => {
      if (m.informational || !m.limit) return;
      const pct = (m.used / m.limit) * 100;
      let sev = 'ok';
      if (pct >= state.thresholds.bad) sev = 'bad';
      else if (pct >= state.thresholds.warn) sev = 'warn';
      const key = `${p.id}.${m.label}`;
      const prev = state.alertedState[key] || 'ok';
      newAlerted[key] = sev;
      if (order[sev] > order[prev]) {
        transitions.push({
          provider: p.name, label: m.label,
          used: m.used, limit: m.limit,
          pct: Math.round(pct), sev,
        });
      }
    });
  });
  state.alertedState = newAlerted;
  return transitions;
}

async function checkAndNotify() {
  const slack = (state.webhooks.slack || '').trim();
  const discord = (state.webhooks.discord || '').trim();
  if (!slack && !discord) {
    // Even with no webhooks set, keep alertedState fresh so once they ARE set
    // we don't fire historical alerts.
    computeTransitions();
    saveState();
    return;
  }
  const transitions = computeTransitions();
  saveState();
  if (transitions.length === 0) return;
  const tasks = [];
  if (slack)   tasks.push(sendWebhook(slack,   formatSlackPayload(transitions)));
  if (discord) tasks.push(sendWebhook(discord, formatDiscordPayload(transitions)));
  await Promise.all(tasks);
}

// ===== Refresh =====
async function refreshAll() {
  const btn = document.getElementById('refresh-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span>${escapeHtml(t('toolbar.refreshing'))}`;
  PROVIDERS.forEach((p) => {
    if (!state.keys[p.id]) return;
    const card = document.querySelector(`.card[data-provider="${p.id}"]`);
    if (card) card.classList.add('refreshing');
  });
  let anySucceeded = false;
  try {
    const results = await Promise.all(PROVIDERS.map((p) => probe(p.id)));
    PROVIDERS.forEach((p, i) => {
      const r = results[i];
      if (r && r.error === 'no_key') { state.lastResults[p.id] = null; return; }
      state.lastResults[p.id] = PARSERS[p.parser](r);
      if (r && !r.error) anySucceeded = true;
    });
    state.lastChecked = Date.now();
    renderProviders();
    if (anySucceeded) firePulse();
    // Fire-and-forget — don't block UI on webhook delivery.
    checkAndNotify();
  } finally {
    btn.disabled = false;
    btn.textContent = t('toolbar.refresh');
  }
}
function firePulse() {
  const el = document.getElementById('updated-wrap');
  if (!el) return;
  el.classList.remove('pulsing');
  void el.offsetWidth;
  el.classList.add('pulsing');
  setTimeout(() => el.classList.remove('pulsing'), 1300);
}
document.getElementById('refresh-btn').addEventListener('click', refreshAll);

// ===== Auto refresh =====
let autoTimer = null;
function applyAutoRefresh() {
  const btn = document.getElementById('auto-refresh-toggle');
  btn.textContent = state.autoRefresh ? t('toolbar.autoOn') : t('toolbar.autoOff');
  btn.classList.toggle('on', state.autoRefresh);
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  if (state.autoRefresh) autoTimer = setInterval(refreshAll, 60_000);
}
document.getElementById('auto-refresh-toggle').addEventListener('click', () => {
  state.autoRefresh = !state.autoRefresh;
  saveState();
  applyAutoRefresh();
});

// ===== Init =====
loadState();
applyTheme();
applyAurora();
setLang(currentLang);
