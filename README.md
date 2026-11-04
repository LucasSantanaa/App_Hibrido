# SaborExpress — P1 com Expo Router

Aplicativo de delivery desenvolvido em React Native + Expo. Esta versão adapta a navegação do P1 para o **Expo Router**, conforme a atividade da Aula 08.

## O que foi implementado

- Rotas organizadas por arquivos dentro de `app/`.
- Grupo `(auth)` para Onboarding e Login.
- Grupo `(app)` protegido por autenticação.
- `AuthContext` com `AuthProvider`, `signIn` e `signOut`.
- Redirecionamento para o Login quando não existe usuário autenticado.
- Login com `router.replace()` para não voltar à tela de login pelo botão voltar.
- Abas Início, Carrinho e Perfil com `Tabs`.
- Rota dinâmica `details/[id].tsx`, que recebe o identificador com `useLocalSearchParams()`.
- Logout no Perfil, limpando a sessão e voltando ao Login.
- Contexto e funcionalidades originais do carrinho preservados.

A autenticação continua sendo simulada (mock), como no P1 original: qualquer preenchimento ou acesso como convidado permite entrar.

## Estrutura principal

```text
app/
├── _layout.tsx
├── index.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── onboarding.tsx
│   └── login.tsx
└── (app)/
    ├── _layout.tsx
    ├── order-confirmation.tsx
    ├── details/
    │   └── [id].tsx
    └── (tabs)/
        ├── _layout.tsx
        ├── index.tsx
        ├── cart.tsx
        └── profile.tsx

src/
├── components/
├── context/
│   ├── AuthContext.js
│   └── CartContext.js
├── data/
├── screens/
└── theme/
```

## Como executar

Com Node.js LTS instalado:

```bash
npm install
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo start -c
```

Abra o projeto pelo Expo Go ou em um emulador compatível com o SDK 58.

## Fluxo para testar

1. Abra o app: a tela de Onboarding aparece.
2. Toque em Começar e depois entre com e-mail/senha ou como convidado.
3. O app abre a Home com as abas Início, Carrinho e Perfil.
4. Toque em um produto: o detalhe abre pela rota `/details/[id]`.
5. Use o botão de voltar para retornar à lista.
6. No Perfil, toque em Sair: a sessão é limpa e o Login é exibido.
7. Tente abrir uma rota do grupo `(app)` sem estar logado: o app redireciona para o Login.

## Observação

O Expo Router é baseado na estrutura de arquivos. Os nomes entre parênteses, como `(auth)` e `(app)`, organizam as rotas sem fazer parte do endereço. O arquivo `_layout.tsx` define o navegador do grupo.
