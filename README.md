# SaborExpress — P2 com Expo Router

Aplicativo de delivery feito em React Native e Expo a partir do projeto P1. A navegação usa Expo Router, o cardápio consulta a API pública DummyJSON Recipes e os dados do usuário ficam no armazenamento local com AsyncStorage (sem SQLite).

## Funcionalidades

- Onboarding, login demonstrativo e acesso como convidado.
- Busca de receitas e navegação por categorias.
- Detalhes da receita com ingredientes, imagens e opção de favoritar.
- Favoritos e carrinho persistentes entre reinicializações.
- Cadastro e seleção de endereços.
- Fluxo de checkout, escolha de pagamento demonstrativo e confirmação.
- Histórico e detalhes de pedidos salvos localmente.
- Perfil, configurações e suporte.
- Mensagem e catálogo local de contingência quando a API não está disponível.

O projeto oferece mais de 12 telas navegáveis: onboarding, login, início, busca, categorias, receitas por categoria, detalhes, favoritos, carrinho, endereços, formulário de endereço, entrega, pagamento, confirmação, pedidos, detalhes do pedido, perfil, configurações e suporte.

## Tecnologias

- Expo SDK 58, React Native e Expo Router.
- StyleSheet e layouts Flexbox.
- API: [DummyJSON Recipes](https://dummyjson.com/docs/recipes).
- Persistência local: `@react-native-async-storage/async-storage`.

O login e o checkout são demonstrativos; o app não processa pagamentos reais. Os dados armazenados localmente são sessão, carrinho, favoritos, endereços, preferências e pedidos.

## Como executar

```bash
npm install
npx expo start
```

Abra pelo Expo Go compatível com o SDK do projeto ou use um emulador.
