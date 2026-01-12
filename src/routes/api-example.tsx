import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

export const Route = createFileRoute('/api-example')({
  component: ApiExample,
})

function ApiExample() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [divideA, setDivideA] = useState('')
  const [divideB, setDivideB] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Query: Get todos (auto-fetched on mount)
  const todosQuery = useQuery(orpc.getTodos.queryOptions())

  // Query: Get current time (manual fetch)
  const timeQuery = useQuery({
    ...orpc.getCurrentTime.queryOptions(),
    enabled: false, // Don't auto-fetch
  })

  // Mutation: Hello (no input)
  const helloMutation = useMutation(
    orpc.hello.mutationOptions({
      onSuccess: (data) => {
        setSuccessMessage(data.message)
      },
    }),
  )

  // Mutation: Greet (with input validation)
  const greetMutation = useMutation(
    orpc.greet.mutationOptions({
      onSuccess: (data) => {
        setSuccessMessage(data.message)
        setName('') // Clear input on success
      },
    }),
  )

  // Mutation: Divide (with error handling)
  const divideMutation = useMutation(
    orpc.divide.mutationOptions({
      onSuccess: (data) => {
        setSuccessMessage(`Result: ${data.result}`)
      },
    }),
  )

  const handleHello = () => {
    helloMutation.mutate({})
  }

  const handleGreet = () => {
    if (!name.trim()) {
      return
    }
    greetMutation.mutate({ name })
  }

  const handleDivide = () => {
    const a = parseFloat(divideA)
    const b = parseFloat(divideB)

    if (isNaN(a) || isNaN(b)) {
      return
    }

    divideMutation.mutate({ a, b })
  }

  const handleGetTime = () => {
    timeQuery.refetch()
  }

  const handleRefreshTodos = () => {
    queryClient.invalidateQueries({ queryKey: orpc.getTodos.key() })
  }

  // Combine all loading states
  const isLoading =
    helloMutation.isPending ||
    greetMutation.isPending ||
    divideMutation.isPending ||
    timeQuery.isFetching

  // Get the first error from any mutation or query
  const error =
    helloMutation.error ||
    greetMutation.error ||
    divideMutation.error ||
    todosQuery.error ||
    timeQuery.error

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">
        oRPC + TanStack Query Examples
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 text-red-900">
          {error.message}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-50 p-4 text-green-900">
          {successMessage}
        </div>
      )}

      {timeQuery.data && (
        <div className="mb-4 rounded-lg border border-blue-500 bg-blue-50 p-4 text-blue-900">
          Current time: {timeQuery.data.timestamp} ({timeQuery.data.timezone})
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simple Hello</CardTitle>
            <CardDescription>
              Mutation with no inputs using useMutation hook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleHello} disabled={isLoading}>
              Call hello()
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Greet with Name</CardTitle>
            <CardDescription>
              Mutation with input validation and success callback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  onKeyDown={(e) => e.key === 'Enter' && handleGreet()}
                />
              </Field>
              <Button
                onClick={handleGreet}
                disabled={isLoading || !name.trim()}
              >
                Call greet()
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Division Calculator</CardTitle>
            <CardDescription>
              Example with error handling (try dividing by zero!)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Number A</FieldLabel>
                  <Input
                    type="number"
                    value={divideA}
                    onChange={(e) => setDivideA(e.target.value)}
                    placeholder="10"
                  />
                </Field>
                <Field>
                  <FieldLabel>Number B</FieldLabel>
                  <Input
                    type="number"
                    value={divideB}
                    onChange={(e) => setDivideB(e.target.value)}
                    placeholder="2"
                  />
                </Field>
              </div>
              <Button
                onClick={handleDivide}
                disabled={isLoading || !divideA || !divideB}
              >
                Call divide()
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Todos</CardTitle>
            <CardDescription>
              Auto-fetched query using useQuery hook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRefreshTodos}
              disabled={todosQuery.isFetching}
              className="mb-4"
            >
              {todosQuery.isFetching ? 'Refreshing...' : 'Refresh Todos'}
            </Button>
            {todosQuery.isLoading ? (
              <p className="text-sm text-gray-500">Loading todos...</p>
            ) : todosQuery.data && todosQuery.data.length > 0 ? (
              <ul className="space-y-2">
                {todosQuery.data.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      className="rounded"
                    />
                    <span>{todo.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
            <CardDescription>
              Manual query with enabled: false (fetch on demand)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetTime} disabled={timeQuery.isFetching}>
              {timeQuery.isFetching ? 'Fetching...' : 'Get Current Time'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
