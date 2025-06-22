import React from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Flex,
  Button,
  Link,
  Modal,
} from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';
import styled from 'styled-components';

interface InputProps {
  attribute: {
    type: string;
    customField: string;
    options?: {
      url?: string;
      disableIframe?: boolean;
      defaultValue?: string;
      required?: boolean;
      regex?: string;
      minLength?: number;
      unique?: boolean;
    };
  };
  description?: { id: string; defaultMessage: string };
  disabled?: boolean;
  intlLabel?: { id: string; defaultMessage: string };
  name: string;
  onChange: (e: { target: { name: string; type: string; value: string } }) => void;
  required?: boolean;
  value?: string;
  error?: string;
}

// Define styled component outside of the render method
const ModalContent = styled(Modal.Content)`
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100% !important;
  max-height: 100% !important;
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ attribute }, ref) => {
    const { formatMessage } = useIntl();

    const effectiveValue =
      attribute?.options?.url || attribute?.options?.defaultValue || '';
    const disableIframe = attribute?.options?.disableIframe;

    if (!effectiveValue) return null;

    const buttonLabel = formatMessage({
      id: 'component-docs.view-docs',
      defaultMessage: 'View Documentation',
    });

    return (
      <>
        <Box style={{ width: '100%' }}>
          <Flex justifyContent="flex-end" paddingTop={2}>
            {!disableIframe ? (
              <Modal.Root>
                <Modal.Trigger>
                  <Button
                    variant="tertiary"
                    startIcon={<ExternalLink />}
                    ref={ref}
                  >
                    {buttonLabel}
                  </Button>
                </Modal.Trigger>


                <ModalContent className="docs-modal-content">
                  <Modal.Header>
                    <Modal.Title>
                      {formatMessage({
                        id: 'component-docs.modal-title',
                        defaultMessage: 'Component Documentation',
                      })}
                    </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Box
                      padding={4}
                      background="neutral100"
                      hasRadius
                      style={{ height: '80vh' }}
                    >
                      <iframe
                        src={effectiveValue}
                        title="Component Documentation"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    </Box>
                  </Modal.Body>

                  <Modal.Footer>
                    <Modal.Close>
                      <Button variant="tertiary">
                        {formatMessage({
                          id: 'component-docs.modal-close',
                          defaultMessage: 'Close',
                        })}
                      </Button>
                    </Modal.Close>
                  </Modal.Footer>
                </ModalContent>
              </Modal.Root>
            ) : (
              <Link
                href={effectiveValue}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="tertiary"
                  startIcon={<ExternalLink />}
                  ref={ref}
                >
                  {buttonLabel}
                </Button>
              </Link>
            )}
          </Flex>
        </Box>
      </>
    );
  }
);

Input.displayName = 'DocsLinkInput';

export default Input;
