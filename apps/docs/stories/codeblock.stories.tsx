import type { Meta, StoryObj } from '@storybook/react';
import { Codeblock } from '@signozhq/codeblock';

import { generateDocs } from '../utils/generateDocs';

/* eslint-disable no-useless-escape */
const code = `Traceback (most recent call last):\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connection.py\", line 174, in _new_conn\n    conn = connection.create_connection(\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/util/connection.py\", line 72, in create_connection\n    for res in socket.getaddrinfo(host, port, family, socket.SOCK_STREAM):\n  File \"/usr/local/lib/python3.8/socket.py\", line 930, in getaddrinfo\n    for res in _socket.getaddrinfo(host, port, family, type, proto, flags):\nsocket.gaierror: [Errno -2] Name or service not known\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connectionpool.py\", line 716, in urlopen\n    httplib_response = self._make_request(\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connectionpool.py\", line 404, in _make_request\n    self._validate_conn(conn)\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connectionpool.py\", line 1061, in _validate_conn\n    conn.connect()\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connection.py\", line 363, in connect\n    self.sock = conn = self._new_conn()\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connection.py\", line 186, in _new_conn\n    raise NewConnectionError(\nurllib3.exceptions.NewConnectionError: <urllib3.connection.HTTPSConnection object at 0x7b89a8543130>: Failed to establish a new connection: [Errno -2] Name or service not known\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/usr/local/lib/python3.8/site-packages/requests/adapters.py\", line 439, in send\n    resp = conn.urlopen(\n  File \"/usr/local/lib/python3.8/site-packages/opentelemetry/instrumentation/urllib3/__init__.py\", line 228, in instrumented_urlopen\n    return wrapped(*args, **kwargs)\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/connectionpool.py\", line 802, in urlopen\n    retries = retries.increment(\n  File \"/usr/local/lib/python3.8/site-packages/urllib3/util/retry.py\", line 594, in increment\n    raise MaxRetryError(_pool, url, error or ResponseError(cause))\nurllib3.exceptions.MaxRetryError: HTTPSConnectionPool(host='rufn.fmoceky.io', port=443): Max retries exceeded with url: /v3/b851a5c6-ab54-495a-be04-69834ae0d2a7 (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7b89a8543130>: Failed to establish a new connection: [Errno -2] Name or service not known'))\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File \"/usr/local/lib/python3.8/site-packages/opentelemetry/trace/__init__.py\", line 573, in use_span\n    yield span\n  File \"/usr/local/lib/python3.8/site-packages/opentelemetry/sdk/trace/__init__.py\", line 1046, in start_as_current_span\n    yield span_context\n  File \"/usr/local/lib/python3.8/site-packages/opentelemetry/instrumentation/requests/__init__.py\", line 309, in instrumented_send\n    raise exception.with_traceback(exception.__traceback__)\n  File \"/usr/local/lib/python3.8/site-packages/opentelemetry/instrumentation/requests/__init__.py\", line 230, in instrumented_send\n    result = wrapped_send(self, request, **kwargs)  # *** PROCEED\n  File \"/usr/local/lib/python3.8/site-packages/requests/sessions.py\", line 655, in send\n    r = adapter.send(request, **kwargs)\n  File \"/usr/local/lib/python3.8/site-packages/requests/adapters.py\", line 516, in send\n    raise ConnectionError(e, request=request)\nrequests.exceptions.ConnectionError: HTTPSConnectionPool(host='rufn.fmoceky.io', port=443): Max retries exceeded with url: /v3/b851a5c6-ab54-495a-be04-69834ae0d2a7 (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7b89a8543130>: Failed to establish a new connection: [Errno -2] Name or service not known'))\n`;

const CodeblockExamples = [
	`import { Codeblock } from '@signozhq/codeblock';

export default function MyComponent() {
  return (
    <Codeblock code="// Sample Code"/>
  );
}`,
];

const CodeblockDocs = generateDocs({
	packageName: '@signozhq/codeblock',
	description: 'Codeblock highlighting component',
	examples: CodeblockExamples,
});

const meta: Meta<typeof Codeblock> = {
	title: 'Components/Codeblock',
	component: Codeblock,
	argTypes: {
		title: {
			control: 'text',
		},
		code: {
			control: 'text',
			description: 'Code to Highlight',
			required: true,
		},
		lang: {
			control: 'select',
			options: ['javascript', 'typescript'],
		},
		theme: {
			control: 'select',
			options: ['light', 'dark'],
		},
		showLineNumbers: {
			control: 'boolean',
		},
	},
	parameters: {
		docs: {
			description: {
				component: CodeblockDocs,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Codeblock>;

export const Default: Story = {
	args: {
		code: code,
		title: 'Stacktrace',
		lang: 'javascript',
		theme: 'dark',
		highlightedLines: [34, 35, 36],
		addedLines: [4, 5, 6],
		removedLines: [10, 11],
		warningLines: [20, 21],
		showLineNumbers: true,
		// Add default props here
	},
};
