import React from 'react'
import { Container, Title } from 'bonde-styleguide'

const View = ({ t, children }) => (
  <Container>
    <Title.H1 margin={{ bottom: 37 }}>
      {t('container.text')}
    </Title.H1>
    {children}
  </Container>
)

export default View
